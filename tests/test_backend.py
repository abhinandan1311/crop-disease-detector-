import io
import unittest

from fastapi.testclient import TestClient
from PIL import Image

from main import app


class FakeModel:
    available = True
    error = None
    labels = ["Tomato___Tomato_Early_blight", "Tomato___healthy"]

    def predict(self, image: Image.Image) -> list[float]:
        if image.mode != "RGB":
            raise ValueError("Expected RGB preprocessing.")
        return [0.91, 0.09]


class FakeSupabase:
    configured = True
    bucket = "leaf-images"

    def __init__(self) -> None:
        self.users = {
            "first-token": {
                "id": "user-first",
                "email": "first@example.com",
            },
            "second-token": {
                "id": "user-second",
                "email": "second@example.com",
            },
        }
        self.scans: dict[str, dict] = {}
        self.feedback: list[dict] = []
        self.images: dict[str, bytes] = {}
        self.storage_ready = True
        self.diseases = [
            {
                "id": "11111111-1111-4111-8111-111111111111",
                "category": "Vegetables",
                "crop": "Tomato",
                "name": "Early blight",
                "description": "Test disease description",
                "recommendation": "Test disease recommendation",
            }
        ]

    async def authenticate(self, token: str) -> dict:
        user = self.users.get(token)
        if user is None:
            from supabase_client import SupabaseRequestError

            raise SupabaseRequestError(401, "Unauthorized")
        return user

    async def health(self) -> bool:
        return True

    async def storage_bucket_exists(self) -> bool:
        return self.storage_ready

    async def list_diseases(self) -> list[dict]:
        return self.diseases

    async def get_disease(self, disease_id: str) -> dict | None:
        return next((item for item in self.diseases if item["id"] == disease_id), None)

    async def upload_image(
        self,
        *,
        access_token: str,
        user_id: str,
        scan_id: str,
        extension: str,
        content_type: str,
        content: bytes,
    ) -> str:
        self.assert_owner(access_token, user_id)
        if content_type not in {"image/jpeg", "image/png", "image/webp"}:
            raise AssertionError("Unexpected image content type.")
        path = f"{user_id}/{scan_id}{extension}"
        self.images[path] = content
        return path

    async def delete_image(self, access_token: str, path: str) -> None:
        del access_token
        self.images.pop(path, None)

    async def create_scan(self, access_token: str, scan: dict) -> dict:
        self.assert_owner(access_token, scan["user_id"])
        self.scans[scan["id"]] = {**scan, "created_at": "2026-10-12T12:00:00Z"}
        return self.scans[scan["id"]]

    async def list_scans(
        self, access_token: str, user_id: str, limit: int, offset: int
    ) -> list[dict]:
        self.assert_owner(access_token, user_id)
        rows = [scan for scan in self.scans.values() if scan["user_id"] == user_id]
        return rows[offset : offset + limit]

    async def get_scan(
        self, access_token: str, user_id: str, scan_id: str
    ) -> dict | None:
        self.assert_owner(access_token, user_id)
        scan = self.scans.get(scan_id)
        return scan if scan and scan["user_id"] == user_id else None

    async def create_signed_image_url(self, access_token: str, path: str) -> str:
        del access_token
        return f"https://example.supabase.co/storage/v1/object/sign/leaf-images/{path}?token=test"

    async def create_feedback(self, access_token: str, feedback: dict) -> dict:
        self.assert_owner(access_token, feedback["user_id"])
        saved = {"id": f"feedback-{len(self.feedback) + 1}", **feedback}
        self.feedback.append(saved)
        return saved

    def assert_owner(self, token: str, user_id: str) -> None:
        if self.users[token]["id"] != user_id:
            raise AssertionError("Cross-user Supabase operation in test.")


def make_test_image() -> bytes:
    buffer = io.BytesIO()
    Image.new("RGB", (32, 32), color=(40, 150, 40)).save(buffer, format="JPEG")
    return buffer.getvalue()


class BackendApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.client_context = TestClient(app)
        self.client = self.client_context.__enter__()
        self.supabase = FakeSupabase()
        app.state.supabase = self.supabase
        app.state.model = FakeModel()

    def tearDown(self) -> None:
        self.client_context.__exit__(None, None, None)

    @staticmethod
    def auth(token: str = "first-token") -> dict[str, str]:
        return {"Authorization": f"Bearer {token}"}

    def test_health_and_disease_catalog(self) -> None:
        health = self.client.get("/health")
        self.assertEqual(health.status_code, 200)
        self.assertEqual(health.json()["status"], "healthy")
        self.assertEqual(health.json()["database"], "connected")
        self.assertEqual(health.json()["storage"], "available")
        diseases = self.client.get("/api/v1/diseases")
        self.assertEqual(diseases.status_code, 200)
        self.assertEqual(
            diseases.json()[0]["id"], "11111111-1111-4111-8111-111111111111"
        )
        self.assertEqual(diseases.json()[0]["category"], "Vegetables")
        self.assertEqual(
            self.client.get(
                "/api/v1/diseases/11111111-1111-4111-8111-111111111111"
            ).status_code,
            200,
        )
        self.assertEqual(
            self.client.get("/api/v1/diseases/not-a-disease").status_code,
            404,
        )

    def test_health_reports_missing_storage_bucket_and_disables_diagnosis(self) -> None:
        self.supabase.storage_ready = False
        health = self.client.get("/health").json()

        self.assertEqual(health["status"], "degraded")
        self.assertEqual(health["database"], "connected")
        self.assertEqual(health["storage"], "missing")
        self.assertFalse(health["diagnosis_available"])

    def test_supabase_authentication_and_user_identity(self) -> None:
        response = self.client.get(
            "/api/v1/scans", headers=self.auth("unknown-token")
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(self.client.get("/api/v1/scans").status_code, 401)

    def test_missing_storage_bucket_returns_migration_guidance(self) -> None:
        from supabase_client import SupabaseRequestError

        async def reject_upload(**kwargs: object) -> str:
            del kwargs
            raise SupabaseRequestError(400, "Bucket not found")

        self.supabase.upload_image = reject_upload
        response = self.client.post(
            "/api/v1/diagnose",
            headers=self.auth(),
            files={"file": ("leaf.jpg", make_test_image(), "image/jpeg")},
        )

        self.assertEqual(response.status_code, 503)
        self.assertIn(
            "20261016000000_reconcile_legacy_scan_schema.sql",
            response.json()["detail"],
        )

    def test_prediction_storage_history_signed_image_and_user_isolation(self) -> None:
        response = self.client.post(
            "/api/v1/diagnose",
            headers=self.auth(),
            files={"file": ("leaf.jpg", make_test_image(), "image/jpeg")},
        )
        self.assertEqual(response.status_code, 200, response.text)
        result = response.json()
        self.assertEqual(result["prediction"]["crop"], "Tomato")
        self.assertEqual(result["prediction"]["disease"], "Early blight")
        self.assertEqual(result["prediction"]["confidence"], 0.91)
        self.assertEqual(
            result["disease_info"]["id"], "11111111-1111-4111-8111-111111111111"
        )

        history = self.client.get("/api/v1/scans", headers=self.auth())
        self.assertEqual(history.status_code, 200)
        self.assertEqual(len(history.json()["items"]), 1)
        scan_id = result["scan_id"]
        self.assertEqual(
            self.client.get(
                f"/api/v1/scans/{scan_id}", headers=self.auth()
            ).status_code,
            200,
        )
        signed_url = self.client.get(
            f"/api/v1/scans/{scan_id}/image", headers=self.auth()
        )
        self.assertEqual(signed_url.status_code, 200, signed_url.text)
        self.assertIn("signed_url", signed_url.json())
        self.assertEqual(
            self.client.get(
                f"/api/v1/scans/{scan_id}",
                headers=self.auth("second-token"),
            ).status_code,
            404,
        )

        feedback = self.client.post(
            "/api/v1/feedback",
            headers=self.auth(),
            json={
                "scan_id": scan_id,
                "predicted_disease": "Early blight",
                "corrected_disease": "Healthy",
            },
        )
        self.assertEqual(feedback.status_code, 201, feedback.text)
        self.assertEqual(feedback.json()["status"], "saved")

    def test_model_labels_with_repeated_crop_prefix_match_disease_guidance(self) -> None:
        cases = [
            ("Apple___Apple Scab", "Apple", "Apple Scab"),
            ("Coffee___Coffee Leaf Rust", "Coffee", "Coffee Leaf Rust"),
            ("Peach___Peach Leaf Curl", "Peach", "Peach Leaf Curl"),
            ("Rice___Rice Blast", "Rice", "Rice Blast"),
            ("Soybean___Soybean Rust", "Soybean", "Soybean Rust"),
        ]
        self.supabase.diseases = [
            {
                "id": f"disease-{index}",
                "category": "Test",
                "crop": crop,
                "name": disease,
                "description": "Test disease description",
                "recommendation": "Test disease recommendation",
            }
            for index, (_, crop, disease) in enumerate(cases)
        ]

        for index, (label, _, disease) in enumerate(cases):
            app.state.model.labels = [label, "Tomato___healthy"]
            response = self.client.post(
                "/api/v1/diagnose",
                headers=self.auth(),
                files={"file": ("leaf.jpg", make_test_image(), "image/jpeg")},
            )
            self.assertEqual(response.status_code, 200, response.text)
            self.assertEqual(
                response.json()["disease_info"]["id"], f"disease-{index}"
            )
            self.assertEqual(response.json()["disease_info"]["name"], disease)

    def test_upload_validation(self) -> None:
        wrong_type = self.client.post(
            "/api/v1/diagnose",
            headers=self.auth(),
            files={"file": ("notes.txt", b"text", "text/plain")},
        )
        self.assertEqual(wrong_type.status_code, 415)
        malformed_image = self.client.post(
            "/api/v1/diagnose",
            headers=self.auth(),
            files={"file": ("leaf.jpg", b"not an image", "image/jpeg")},
        )
        self.assertEqual(malformed_image.status_code, 400)
        mismatched_type = self.client.post(
            "/api/v1/diagnose",
            headers=self.auth(),
            files={"file": ("leaf.png", make_test_image(), "image/png")},
        )
        self.assertEqual(mismatched_type.status_code, 400)

    def test_rejects_scan_feedback_without_scan_or_image(self) -> None:
        response = self.client.post(
            "/api/v1/feedback",
            headers=self.auth(),
            json={
                "predicted_disease": "Early blight",
                "corrected_disease": "Healthy",
            },
        )
        self.assertEqual(response.status_code, 422)

    def test_valid_image_returns_service_unavailable_without_model(self) -> None:
        app.state.model = type(
            "UnavailableModel",
            (),
            {"available": False, "error": "No model configured."},
        )()
        response = self.client.post(
            "/api/v1/diagnose",
            headers=self.auth(),
            files={"file": ("leaf.jpg", make_test_image(), "image/jpeg")},
        )
        self.assertEqual(response.status_code, 503)
        self.assertIn("trained model", response.json()["detail"])
        self.assertEqual(self.supabase.scans, {})

    def test_upstream_supabase_not_configured_is_explicit(self) -> None:
        app.state.supabase.configured = False
        response = self.client.get("/api/v1/diseases")
        self.assertEqual(response.status_code, 503)


if __name__ == "__main__":
    unittest.main()
