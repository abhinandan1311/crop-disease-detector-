import unittest

import httpx

from supabase_client import SupabaseGateway, SupabaseRequestError


class SupabaseGatewayTests(unittest.IsolatedAsyncioTestCase):
    async def test_disease_catalog_requests_category(self) -> None:
        def handle(request: httpx.Request) -> httpx.Response:
            self.assertEqual(
                request.url.params["select"],
                "id,category,crop,name,description,recommendation",
            )
            return httpx.Response(
                200,
                json=[
                    {
                        "id": "11111111-1111-4111-8111-111111111111",
                        "category": "Vegetables",
                        "crop": "Tomato",
                        "name": "Early blight",
                        "description": "Description",
                        "recommendation": "Recommendation",
                    }
                ],
            )

        async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as http:
            gateway = SupabaseGateway(
                http,
                "https://project.supabase.co",
                "public-anon-key",
                "crop-scans",
            )
            diseases = await gateway.list_diseases()

        self.assertEqual(diseases[0]["category"], "Vegetables")

    async def test_storage_bucket_health_distinguishes_missing_bucket(self) -> None:
        statuses = iter(
            [
                httpx.Response(
                    400,
                    json={
                        "statusCode": "404",
                        "error": "Bucket not found",
                        "message": "Bucket not found",
                        "code": "NoSuchBucket",
                    },
                ),
                httpx.Response(200, json={"id": "crop-scans", "public": False}),
            ]
        )

        async def handle(request: httpx.Request) -> httpx.Response:
            self.assertEqual(request.url.path, "/storage/v1/bucket/crop-scans")
            return next(statuses)

        async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as http:
            gateway = SupabaseGateway(
                http,
                "https://project.supabase.co",
                "public-anon-key",
                "crop-scans",
            )
            self.assertFalse(await gateway.storage_bucket_exists())
            self.assertTrue(await gateway.storage_bucket_exists())

    async def test_upload_does_not_treat_missing_bucket_as_success(self) -> None:
        def reject(request: httpx.Request) -> httpx.Response:
            self.assertEqual(
                request.url.path,
                "/storage/v1/object/crop-scans/user-123/scan-123.jpg",
            )
            return httpx.Response(
                404,
                json={"message": "Bucket not found", "error": "Not Found"},
            )

        async with httpx.AsyncClient(transport=httpx.MockTransport(reject)) as http:
            gateway = SupabaseGateway(
                http,
                "https://project.supabase.co",
                "public-anon-key",
                "crop-scans",
            )
            with self.assertRaises(SupabaseRequestError) as raised:
                await gateway.upload_image(
                    access_token="user-access-token",
                    user_id="user-123",
                    scan_id="scan-123",
                    extension=".jpg",
                    content_type="image/jpeg",
                    content=b"validated-image-bytes",
                )

        self.assertEqual(raised.exception.status_code, 404)
        self.assertIn("Bucket not found", str(raised.exception))

    async def test_auth_storage_database_and_signed_url_requests_use_user_token(self) -> None:
        seen: list[httpx.Request] = []

        def handle(request: httpx.Request) -> httpx.Response:
            seen.append(request)
            if request.url.path == "/auth/v1/user":
                return httpx.Response(200, json={"id": "user-123"})
            if request.url.path.startswith("/storage/v1/object/sign/"):
                return httpx.Response(
                    200,
                    json={
                        "signedURL": "/object/sign/leaf-images/user-123/scan.jpg?token=private"
                    },
                )
            if request.url.path == "/rest/v1/scans":
                return httpx.Response(201, json=[{"id": "scan-123"}])
            if request.url.path.startswith("/storage/v1/object/leaf-images/"):
                return httpx.Response(200, json={"Key": "leaf-images/user-123/scan.jpg"})
            return httpx.Response(404, json={"message": "Unexpected request"})

        async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as http:
            gateway = SupabaseGateway(
                http,
                "https://project.supabase.co",
                "public-anon-key",
                "leaf-images",
            )
            user = await gateway.authenticate("user-access-token")
            path = await gateway.upload_image(
                access_token="user-access-token",
                user_id=user["id"],
                scan_id="scan-123",
                extension=".jpg",
                content_type="image/jpeg",
                content=b"validated-image-bytes",
            )
            scan = await gateway.create_scan(
                "user-access-token",
                {
                    "id": "scan-123",
                    "user_id": user["id"],
                    "image_path": path,
                    "confidence": 0.95,
                },
            )
            signed_url = await gateway.create_signed_image_url(
                "user-access-token", path
            )

        self.assertEqual(user["id"], "user-123")
        self.assertEqual(path, "user-123/scan-123.jpg")
        self.assertEqual(scan["id"], "scan-123")
        self.assertTrue(signed_url.startswith("https://project.supabase.co/storage/v1/"))
        self.assertTrue(seen)
        for request in seen:
            self.assertEqual(request.headers["apikey"], "public-anon-key")
            self.assertEqual(
                request.headers["authorization"], "Bearer user-access-token"
            )

    async def test_legacy_scan_images_are_read_and_signed_from_their_original_bucket(self) -> None:
        seen: list[httpx.Request] = []

        def handle(request: httpx.Request) -> httpx.Response:
            seen.append(request)
            if request.url.path == "/rest/v1/scans":
                if "image_path" in request.url.params["select"]:
                    return httpx.Response(
                        400,
                        json={"message": "column scans.image_path does not exist"},
                    )
                return httpx.Response(
                    200,
                    json=[
                        {
                            "id": "scan-123",
                            "user_id": "user-123",
                            "image_url": (
                                "https://project.supabase.co/storage/v1/object/"
                                "public/leaf-images/user-123/scan.jpg"
                            ),
                            "crop": "Tomato",
                            "disease": "Early blight",
                            "confidence": 0.95,
                            "is_healthy": False,
                            "top_candidates": [],
                            "created_at": "2026-10-12T12:00:00Z",
                        }
                    ],
                )
            if request.url.path == (
                "/storage/v1/object/sign/leaf-images/user-123/scan.jpg"
            ):
                return httpx.Response(
                    200,
                    json={"signedURL": "/object/sign/leaf-images/user-123/scan.jpg"},
                )
            return httpx.Response(404, json={"message": "Unexpected request"})

        async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as http:
            gateway = SupabaseGateway(
                http,
                "https://project.supabase.co",
                "public-anon-key",
                "crop-scans",
            )
            scans = await gateway.list_scans(
                "user-access-token", "user-123", limit=100, offset=0
            )
            signed_url = await gateway.create_signed_image_url(
                "user-access-token", scans[0]["image_path"]
            )

        self.assertEqual(len(scans), 1)
        self.assertEqual(
            scans[0]["image_path"],
            "https://project.supabase.co/storage/v1/object/"
            "public/leaf-images/user-123/scan.jpg",
        )
        self.assertEqual(
            signed_url,
            "https://project.supabase.co/storage/v1/object/"
            "sign/leaf-images/user-123/scan.jpg",
        )
        self.assertEqual(
            [request.url.params["select"] for request in seen[:2]],
            [
                SupabaseGateway.scan_columns,
                SupabaseGateway.scan_columns.replace("image_path", "image_url"),
            ],
        )

    async def test_supabase_errors_are_explicit(self) -> None:
        def reject(request: httpx.Request) -> httpx.Response:
            self.assertEqual(request.url.path, "/rest/v1/diseases")
            return httpx.Response(403, json={"message": "RLS denied"})

        async with httpx.AsyncClient(transport=httpx.MockTransport(reject)) as http:
            gateway = SupabaseGateway(
                http,
                "https://project.supabase.co",
                "public-anon-key",
                "leaf-images",
            )
            with self.assertRaises(SupabaseRequestError) as raised:
                await gateway.list_diseases()

        self.assertEqual(raised.exception.status_code, 403)
        self.assertIn("RLS denied", str(raised.exception))


if __name__ == "__main__":
    unittest.main()
