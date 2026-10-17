from typing import Any
from urllib.parse import quote, unquote, urlsplit

import httpx


class SupabaseRequestError(Exception):
    def __init__(self, status_code: int, message: str) -> None:
        super().__init__(message)
        self.status_code = status_code


class SupabaseGateway:
    scan_columns = (
        "id,user_id,image_path,crop,disease,confidence,is_healthy,"
        "top_candidates,created_at"
    )

    def __init__(
        self,
        http: httpx.AsyncClient,
        project_url: str | None,
        anon_key: str | None,
        bucket: str,
    ) -> None:
        self.http = http
        self.project_url = project_url
        self.anon_key = anon_key
        self.bucket = bucket

    @property
    def configured(self) -> bool:
        return bool(self.project_url and self.anon_key)

    def _headers(self, access_token: str | None = None) -> dict[str, str]:
        if not self.configured:
            raise SupabaseRequestError(503, "Supabase is not configured.")
        headers = {"apikey": self.anon_key or ""}
        if access_token:
            headers["Authorization"] = f"Bearer {access_token}"
        return headers

    async def _request(
        self,
        method: str,
        path: str,
        *,
        access_token: str | None = None,
        json_body: Any = None,
        content: bytes | None = None,
        headers: dict[str, str] | None = None,
        params: dict[str, str] | None = None,
    ) -> Any:
        request_headers = self._headers(access_token)
        if headers:
            request_headers.update(headers)
        try:
            response = await self.http.request(
                method,
                f"{self.project_url}/{path.lstrip('/')}",
                headers=request_headers,
                json=json_body,
                content=content,
                params=params,
            )
        except httpx.TimeoutException as exc:
            raise SupabaseRequestError(504, "Supabase request timed out.") from exc
        except httpx.HTTPError as exc:
            raise SupabaseRequestError(502, "Could not connect to Supabase.") from exc

        if response.is_error:
            try:
                response_data = response.json()
            except ValueError:
                response_data = {}
            message = (
                response_data.get("msg")
                or response_data.get("message")
                or response_data.get("error_description")
                or response_data.get("error")
                or "Supabase rejected the request."
            )
            raise SupabaseRequestError(response.status_code, str(message)[:500])
        if response.status_code == 204 or not response.content:
            return None
        try:
            return response.json()
        except ValueError as exc:
            raise SupabaseRequestError(502, "Supabase returned an invalid response.") from exc

    async def authenticate(self, access_token: str) -> dict[str, Any]:
        user = await self._request(
            "GET", "/auth/v1/user", access_token=access_token
        )
        if not isinstance(user, dict) or not user.get("id"):
            raise SupabaseRequestError(401, "Invalid Supabase access token.")
        return user

    async def health(self) -> bool:
        await self._request(
            "GET",
            "/rest/v1/diseases",
            params={"select": "id", "limit": "1"},
        )
        return True

    async def storage_bucket_exists(self) -> bool:
        try:
            result = await self._request(
                "GET",
                f"/storage/v1/bucket/{quote(self.bucket, safe='')}",
            )
        except SupabaseRequestError as exc:
            if "bucket not found" in str(exc).lower():
                return False
            raise
        if not isinstance(result, dict):
            raise SupabaseRequestError(
                502, "Supabase returned invalid Storage bucket information."
            )
        return True

    async def list_diseases(self) -> list[dict[str, Any]]:
        result = await self._request(
            "GET",
            "/rest/v1/diseases",
            params={
                "select": "id,category,crop,name,description,recommendation",
                "order": "crop.asc,name.asc",
            },
        )
        if not isinstance(result, list):
            raise SupabaseRequestError(502, "Supabase returned invalid disease data.")
        return result

    async def get_disease(self, disease_id: str) -> dict[str, Any] | None:
        result = await self._request(
            "GET",
            "/rest/v1/diseases",
            params={
                "id": f"eq.{disease_id}",
                "select": "id,category,crop,name,description,recommendation",
                "limit": "1",
            },
        )
        return result[0] if isinstance(result, list) and result else None

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
        path = f"{user_id}/{scan_id}{extension}"
        await self._request(
            "POST",
            f"/storage/v1/object/{quote(self.bucket, safe='')}/{quote(path, safe='/')}",
            access_token=access_token,
            content=content,
            headers={"Content-Type": content_type, "x-upsert": "false"},
        )
        return path

    async def delete_image(self, access_token: str, path: str) -> None:
        await self._request(
            "DELETE",
            f"/storage/v1/object/{quote(self.bucket, safe='')}",
            access_token=access_token,
            json_body={"prefixes": [path]},
        )

    async def create_scan(
        self, access_token: str, scan: dict[str, Any]
    ) -> dict[str, Any]:
        payload = dict(scan)
        try:
            result = await self._request(
                "POST",
                "/rest/v1/scans",
                access_token=access_token,
                json_body=payload,
                headers={"Prefer": "return=representation"},
            )
        except SupabaseRequestError as exc:
            if "column scans.image_path does not exist" in str(exc).lower() and "image_path" in payload:
                payload["image_url"] = payload.pop("image_path")
                result = await self._request(
                    "POST",
                    "/rest/v1/scans",
                    access_token=access_token,
                    json_body=payload,
                    headers={"Prefer": "return=representation"},
                )
            else:
                raise
        if not isinstance(result, list) or not result:
            raise SupabaseRequestError(502, "Supabase did not return the saved scan.")
        saved = dict(result[0])
        if "image_url" in saved and "image_path" not in saved:
            saved["image_path"] = saved["image_url"]
        return saved

    async def list_scans(
        self, access_token: str, user_id: str, limit: int, offset: int
    ) -> list[dict[str, Any]]:
        return await self._request_scans(
            access_token,
            {
                "user_id": f"eq.{user_id}",
                "order": "created_at.desc",
                "limit": str(limit),
                "offset": str(offset),
            },
        )

    async def get_scan(
        self, access_token: str, user_id: str, scan_id: str
    ) -> dict[str, Any] | None:
        result = await self._request_scans(
            access_token,
            {
                "id": f"eq.{scan_id}",
                "user_id": f"eq.{user_id}",
                "limit": "1",
            },
        )
        return result[0] if isinstance(result, list) and result else None

    async def _request_scans(
        self, access_token: str, params: dict[str, str]
    ) -> list[dict[str, Any]]:
        request_params = {**params, "select": self.scan_columns}
        try:
            result = await self._request(
                "GET",
                "/rest/v1/scans",
                access_token=access_token,
                params=request_params,
            )
        except SupabaseRequestError as exc:
            if "column scans.image_path does not exist" not in str(exc).lower():
                raise
            legacy_params = {
                **params,
                "select": self.scan_columns.replace("image_path", "image_url"),
            }
            result = await self._request(
                "GET",
                "/rest/v1/scans",
                access_token=access_token,
                params=legacy_params,
            )
            if isinstance(result, list):
                return [
                    {**scan, "image_path": scan.get("image_url", "")}
                    for scan in result
                ]

        if not isinstance(result, list):
            raise SupabaseRequestError(502, "Supabase returned invalid scan history.")
        return result

    async def create_signed_image_url(
        self, access_token: str, path: str
    ) -> str:
        bucket = self.bucket
        object_path = path
        if "://" in path:
            image_url = urlsplit(path)
            project_url = urlsplit(self.project_url or "")
            public_prefix = "/storage/v1/object/public/"
            if (
                image_url.scheme != "https"
                or image_url.netloc.lower() != project_url.netloc.lower()
                or not image_url.path.startswith(public_prefix)
            ):
                raise SupabaseRequestError(
                    400, "Legacy image URL is not a public URL from this Supabase project."
                )
            bucket_and_path = image_url.path[len(public_prefix) :]
            bucket_name, separator, encoded_path = bucket_and_path.partition("/")
            if not bucket_name or not separator or not encoded_path:
                raise SupabaseRequestError(400, "Legacy image URL has no storage object path.")
            bucket = unquote(bucket_name)
            object_path = unquote(encoded_path)

        result = await self._request(
            "POST",
            f"/storage/v1/object/sign/{quote(bucket, safe='')}/{quote(object_path, safe='/')}",
            access_token=access_token,
            json_body={"expiresIn": 300},
        )
        if not isinstance(result, dict) or not isinstance(
            result.get("signedURL"), str
        ):
            raise SupabaseRequestError(502, "Supabase did not return an image URL.")
        signed_url = result["signedURL"]
        if signed_url.startswith("/"):
            return f"{self.project_url}/storage/v1{signed_url}"
        return signed_url

    async def create_feedback(
        self, access_token: str, feedback: dict[str, Any]
    ) -> dict[str, Any]:
        result = await self._request(
            "POST",
            "/rest/v1/feedback",
            access_token=access_token,
            json_body=feedback,
            headers={"Prefer": "return=representation"},
        )
        if not isinstance(result, list) or not result:
            raise SupabaseRequestError(502, "Supabase did not return saved feedback.")
        return result[0]
