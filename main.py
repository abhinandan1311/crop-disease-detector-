import asyncio
import logging
import os
import re
import uuid
from contextlib import asynccontextmanager
from dataclasses import dataclass
from io import BytesIO
from typing import Annotated, Any

import httpx
from fastapi import Depends, FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, ConfigDict, Field, model_validator

from ai_engine import DiseaseModel
from config import Settings, get_settings
from supabase_client import SupabaseGateway, SupabaseRequestError


logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("crop_backend")
ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ("JPEG", ".jpg"),
    "image/png": ("PNG", ".png"),
    "image/webp": ("WEBP", ".webp"),
}
bearer_scheme = HTTPBearer(auto_error=False)


class FeedbackRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    scan_id: str | None = None
    image_id: str | None = Field(default=None, max_length=200)
    predicted_disease: str = Field(min_length=1, max_length=200)
    corrected_disease: str = Field(min_length=1, max_length=200)
    agronomist_notes: str | None = Field(default=None, max_length=4000)

    @model_validator(mode="after")
    def require_scan_or_image(self) -> "FeedbackRequest":
        if not self.scan_id and not self.image_id:
            raise ValueError("Provide either scan_id or image_id.")
        return self


@dataclass(frozen=True)
class AuthenticatedUser:
    id: str
    email: str | None
    access_token: str


def _parse_image(
    data: bytes, content_type: str | None, max_pixels: int
) -> tuple[Image.Image, str, str]:
    expected = ALLOWED_IMAGE_TYPES.get(content_type or "")
    if expected is None:
        raise HTTPException(status_code=415, detail="Upload a JPEG, PNG, or WebP image.")
    expected_format, extension = expected
    try:
        with Image.open(BytesIO(data)) as image:
            if image.format != expected_format:
                raise HTTPException(
                    status_code=400,
                    detail="The uploaded image content does not match its content type.",
                )
            width, height = image.size
            if width < 1 or height < 1 or width * height > max_pixels:
                raise HTTPException(
                    status_code=413,
                    detail=f"Image dimensions exceed the {max_pixels:,}-pixel limit.",
                )
            image.verify()
        with Image.open(BytesIO(data)) as image:
            image.load()
            return image.convert("RGB"), extension, expected_format.lower()
    except HTTPException:
        raise
    except (
        UnidentifiedImageError,
        OSError,
        Image.DecompressionBombError,
        ValueError,
    ) as exc:
        raise HTTPException(
            status_code=400, detail="The uploaded file is not a valid image."
        ) from exc


def _split_label(label: str) -> tuple[str, str]:
    if "___" in label:
        crop, disease = label.split("___", 1)
    elif " - " in label:
        crop, disease = label.split(" - ", 1)
    else:
        crop, disease = "Unknown crop", label
    crop_name = crop.replace("_", " ").strip()
    disease_name = disease.replace("_", " ").strip()
    repeated_crop_prefix = f"{crop_name} "
    if disease_name.lower().startswith(repeated_crop_prefix.lower()):
        disease_name = disease_name[len(repeated_crop_prefix) :]
    return crop_name, disease_name


def _normalize_disease_name(name: str, crop: str) -> str:
    normalized = re.sub(r"[^a-z0-9]+", " ", name.lower()).strip()
    normalized_crop = re.sub(r"[^a-z0-9]+", " ", crop.lower()).strip()
    if normalized.startswith(f"{normalized_crop} "):
        normalized = normalized[len(normalized_crop) :].strip()
    return normalized


async def _require_supabase() -> None:
    gateway: SupabaseGateway = app.state.supabase
    if not gateway.configured:
        raise HTTPException(
            status_code=503,
            detail=(
                "Supabase is not configured. Set SUPABASE_URL and either "
                "SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY."
            ),
        )


def _raise_supabase_error(exc: SupabaseRequestError, *, authentication: bool = False) -> None:
    if authentication and exc.status_code in {400, 401, 403}:
        raise HTTPException(status_code=401, detail="Your session is invalid or expired.") from exc
    if exc.status_code == 503:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    if "bucket not found" in str(exc).lower():
        bucket = get_settings().supabase_image_bucket
        raise HTTPException(
            status_code=503,
            detail=(
                f"Supabase Storage bucket '{bucket}' is missing. Run "
                "supabase/migrations/20261016000000_reconcile_legacy_scan_schema.sql "
                "in the Supabase SQL editor."
            ),
        ) from exc
    logger.warning(
        "Supabase request failed with HTTP %s: %s",
        exc.status_code,
        str(exc),
    )
    raise HTTPException(
        status_code=502,
        detail="Supabase rejected or could not complete the request. Check project configuration and RLS policies.",
    ) from exc


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    http = httpx.AsyncClient(timeout=httpx.Timeout(20.0, connect=5.0))
    app.state.settings = settings
    app.state.http = http
    app.state.supabase = SupabaseGateway(
        http,
        settings.supabase_url,
        settings.supabase_anon_key,
        settings.supabase_image_bucket,
    )
    app.state.model = DiseaseModel(
        settings.model_path,
        settings.labels_path,
        settings.image_normalization,
    )
    if not app.state.model.available:
        logger.warning("Disease predictions are unavailable: %s", app.state.model.error)
    try:
        yield
    finally:
        await http.aclose()


app = FastAPI(
    title="AI Crop Disease Detector API",
    description=(
        "Crop disease inference API backed by Supabase Auth, Postgres, private "
        "Storage, and row-level security."
    ),
    version="4.0.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(get_settings().cors_origins),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "apikey"],
)


async def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ],
) -> AuthenticatedUser:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Sign in to continue.")
    await _require_supabase()
    gateway: SupabaseGateway = app.state.supabase
    try:
        user = await gateway.authenticate(credentials.credentials)
    except SupabaseRequestError as exc:
        _raise_supabase_error(exc, authentication=True)
    return AuthenticatedUser(
        id=str(user["id"]),
        email=user.get("email"),
        access_token=credentials.credentials,
    )


CurrentUser = Annotated[AuthenticatedUser, Depends(get_current_user)]


@app.get("/health", tags=["System"])
async def health_check() -> dict[str, Any]:
    settings: Settings = app.state.settings
    gateway: SupabaseGateway = app.state.supabase
    model: DiseaseModel = app.state.model
    database_status = "not_configured"
    storage_status = "not_configured"
    if gateway.configured:
        try:
            await gateway.health()
            database_status = "connected"
        except SupabaseRequestError as exc:
            logger.warning(
                "Supabase database health check failed with HTTP %s: %s",
                exc.status_code,
                str(exc),
            )
            database_status = "unavailable"
        try:
            storage_status = (
                "available" if await gateway.storage_bucket_exists() else "missing"
            )
        except SupabaseRequestError as exc:
            logger.warning(
                "Supabase Storage health check failed with HTTP %s: %s",
                exc.status_code,
                str(exc),
            )
            storage_status = "unavailable"
    diagnosis_available = (
        database_status == "connected"
        and storage_status == "available"
        and model.available
    )
    return {
        "status": (
            "healthy"
            if diagnosis_available
            else "not_configured"
            if database_status == "not_configured"
            else "degraded"
        ),
        "database": database_status,
        "storage_bucket": settings.supabase_image_bucket,
        "storage": storage_status,
        "model": "ready" if model.available else "unavailable",
        "diagnosis_available": diagnosis_available,
        "model_message": None if model.available else model.error,
    }


@app.get("/api/v1/diseases", tags=["Disease information"])
async def list_diseases() -> list[dict[str, Any]]:
    await _require_supabase()
    try:
        return await app.state.supabase.list_diseases()
    except SupabaseRequestError as exc:
        _raise_supabase_error(exc)


@app.get("/api/v1/diseases/{disease_id}", tags=["Disease information"])
async def get_disease(disease_id: str) -> dict[str, Any]:
    await _require_supabase()
    try:
        normalized_id = str(uuid.UUID(disease_id))
    except ValueError:
        raise HTTPException(status_code=404, detail="Disease information was not found.")
    try:
        disease = await app.state.supabase.get_disease(normalized_id)
    except SupabaseRequestError as exc:
        _raise_supabase_error(exc, authentication=exc.status_code == 401)
    if disease is None:
        raise HTTPException(status_code=404, detail="Disease information was not found.")
    return disease


@app.post("/api/v1/diagnose", tags=["Inference & Diagnostics"])
async def diagnose_crop(
    file: Annotated[UploadFile, File(...)],
    current_user: CurrentUser,
) -> dict[str, Any]:
    settings: Settings = app.state.settings
    data = await file.read(settings.max_upload_bytes + 1)
    await file.close()
    if not data:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    if len(data) > settings.max_upload_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"Image exceeds the {settings.max_upload_bytes:,}-byte upload limit.",
        )

    image, extension, image_format = _parse_image(
        data, file.content_type, settings.max_image_pixels
    )
    model: DiseaseModel = app.state.model
    if not model.available:
        raise HTTPException(
            status_code=503,
            detail=(
                "The image is valid but diagnosis is unavailable: the trained model "
                "is not ready. Configure MODEL_PATH and MODEL_LABELS_PATH."
            ),
        )

    try:
        probabilities = await asyncio.to_thread(model.predict, image)
    except Exception as exc:
        logger.exception("Image inference failed.")
        raise HTTPException(
            status_code=500, detail="The configured model failed to process this image."
        ) from exc
    if len(probabilities) != len(model.labels) or not probabilities:
        logger.error("Model output does not match configured class labels.")
        raise HTTPException(status_code=500, detail="The model returned invalid output.")

    top_indices = sorted(
        range(len(probabilities)), key=probabilities.__getitem__, reverse=True
    )[: min(3, len(probabilities))]
    candidates: list[dict[str, Any]] = []
    for index in top_indices:
        crop, disease = _split_label(model.labels[index])
        candidates.append(
            {
                "crop": crop,
                "disease": disease,
                "confidence": round(float(probabilities[index]), 6),
                "is_healthy": "healthy" in disease.lower(),
            }
        )

    primary = candidates[0]
    scan_id = str(uuid.uuid4())
    image_path: str | None = None
    gateway: SupabaseGateway = app.state.supabase
    try:
        image_path = await gateway.upload_image(
            access_token=current_user.access_token,
            user_id=current_user.id,
            scan_id=scan_id,
            extension=extension,
            content_type=f"image/{image_format}",
            content=data,
        )
        scan = await gateway.create_scan(
            current_user.access_token,
            {
                "id": scan_id,
                "user_id": current_user.id,
                "image_path": image_path,
                "crop": primary["crop"],
                "disease": primary["disease"],
                "confidence": primary["confidence"],
                "is_healthy": primary["is_healthy"],
                "top_candidates": candidates,
            },
        )
    except SupabaseRequestError as exc:
        if image_path is not None:
            try:
                await gateway.delete_image(current_user.access_token, image_path)
            except SupabaseRequestError as cleanup_error:
                logger.error(
                    "Supabase upload cleanup failed with HTTP %s.",
                    cleanup_error.status_code,
                )
        _raise_supabase_error(exc, authentication=exc.status_code == 401)

    try:
        disease_records = await gateway.list_diseases()
    except SupabaseRequestError:
        logger.exception("Could not load disease information after saving scan.")
        disease_records = []
    normalized_crop = re.sub(
        r"[^a-z0-9]+", " ", primary["crop"].lower()
    ).strip()
    normalized_disease = _normalize_disease_name(primary["disease"], primary["crop"])
    disease_info = next(
        (
            record
            for record in disease_records
            if re.sub(r"[^a-z0-9]+", " ", record.get("crop", "").lower()).strip()
            == normalized_crop
            and _normalize_disease_name(
                record.get("name", ""), primary["crop"]
            )
            == normalized_disease
        ),
        None,
    )
    if primary["is_healthy"]:
        disease_info = {
            "crop": primary["crop"],
            "name": "Healthy",
            "description": "The configured model classified this image as healthy.",
            "recommendation": (
                "Continue routine monitoring. A model result does not replace "
                "professional field inspection."
            ),
        }

    return {
        "scan_id": scan_id,
        "prediction": primary,
        "top_candidates": candidates,
        "disease_info": disease_info,
        "image_path": image_path,
        "created_at": scan.get("created_at"),
    }


@app.get("/api/v1/scans", tags=["Prediction history"])
async def scan_history(
    current_user: CurrentUser,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> dict[str, Any]:
    try:
        scans = await app.state.supabase.list_scans(
            current_user.access_token, current_user.id, limit, offset
        )
    except SupabaseRequestError as exc:
        _raise_supabase_error(exc, authentication=exc.status_code == 401)
    return {"items": scans, "limit": limit, "offset": offset}


@app.get("/api/v1/scans/{scan_id}", tags=["Prediction history"])
async def get_scan(scan_id: str, current_user: CurrentUser) -> dict[str, Any]:
    try:
        scan = await app.state.supabase.get_scan(
            current_user.access_token, current_user.id, scan_id
        )
    except SupabaseRequestError as exc:
        _raise_supabase_error(exc, authentication=exc.status_code == 401)
    if scan is None:
        raise HTTPException(status_code=404, detail="Scan was not found.")
    return scan


@app.get("/api/v1/scans/{scan_id}/image", tags=["Prediction history"])
async def get_scan_image(scan_id: str, current_user: CurrentUser) -> dict[str, Any]:
    gateway: SupabaseGateway = app.state.supabase
    try:
        scan = await gateway.get_scan(
            current_user.access_token, current_user.id, scan_id
        )
        if scan is None:
            raise HTTPException(status_code=404, detail="Scan was not found.")
        signed_url = await gateway.create_signed_image_url(
            current_user.access_token, scan["image_path"]
        )
    except SupabaseRequestError as exc:
        _raise_supabase_error(exc, authentication=exc.status_code == 401)
    return {"signed_url": signed_url, "expires_in": 300}


@app.post("/api/v1/feedback", status_code=201, tags=["Feedback"])
async def submit_feedback(
    feedback: FeedbackRequest,
    current_user: CurrentUser,
) -> dict[str, Any]:
    gateway: SupabaseGateway = app.state.supabase
    if feedback.scan_id:
        try:
            scan = await gateway.get_scan(
                current_user.access_token, current_user.id, feedback.scan_id
            )
        except SupabaseRequestError as exc:
            _raise_supabase_error(exc, authentication=exc.status_code == 401)
        if scan is None:
            raise HTTPException(status_code=404, detail="Scan was not found.")
    try:
        saved = await gateway.create_feedback(
            current_user.access_token,
            {
                "user_id": current_user.id,
                "scan_id": feedback.scan_id,
                "image_id": feedback.image_id,
                "predicted_disease": feedback.predicted_disease,
                "corrected_disease": feedback.corrected_disease,
                "agronomist_notes": feedback.agronomist_notes,
            },
        )
    except SupabaseRequestError as exc:
        _raise_supabase_error(exc, authentication=exc.status_code == 401)
    return {"feedback_id": saved["id"], "status": "saved"}
