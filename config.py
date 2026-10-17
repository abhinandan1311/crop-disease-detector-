import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parent
load_dotenv(PROJECT_ROOT / ".env", override=False)
if (PROJECT_ROOT / ".venv" / ".env").is_file():
    load_dotenv(PROJECT_ROOT / ".venv" / ".env", override=False)


def _path(value: str | None) -> Path | None:
    if not value:
        return None
    resolved = Path(value).expanduser()
    return resolved if resolved.is_absolute() else PROJECT_ROOT / resolved


@dataclass(frozen=True)
class Settings:
    supabase_url: str | None
    supabase_anon_key: str | None
    supabase_image_bucket: str
    max_upload_bytes: int
    max_image_pixels: int
    cors_origins: tuple[str, ...]
    model_path: Path | None
    labels_path: Path | None
    image_normalization: str


def get_settings() -> Settings:
    supabase_url = (
        os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL") or ""
    ).strip().rstrip("/")
    supabase_anon_key = (
        os.getenv("SUPABASE_ANON_KEY")
        or os.getenv("SUPABASE_PUBLISHABLE_KEY")
        or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        or os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
        or ""
    ).strip()
    if supabase_url and not supabase_url.startswith("https://"):
        raise ValueError("SUPABASE_URL must use HTTPS.")

    origins = tuple(
        origin.strip().rstrip("/")
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if origin.strip()
    )
    if "*" in origins:
        raise ValueError("CORS_ORIGINS must list explicit frontend origins.")

    max_upload_bytes = int(os.getenv("MAX_UPLOAD_BYTES", str(10 * 1024 * 1024)))
    max_image_pixels = int(os.getenv("MAX_IMAGE_PIXELS", str(16_000_000)))
    if max_upload_bytes < 1 or max_image_pixels < 1:
        raise ValueError("Upload byte and image pixel limits must be positive.")
    normalization = os.getenv("MODEL_NORMALIZATION", "0_1")
    if normalization not in {"0_1", "minus1_1"}:
        raise ValueError("MODEL_NORMALIZATION must be '0_1' or 'minus1_1'.")

    return Settings(
        supabase_url=supabase_url or None,
        supabase_anon_key=supabase_anon_key or None,
        supabase_image_bucket=os.getenv("SUPABASE_IMAGE_BUCKET", "crop-scans"),
        max_upload_bytes=max_upload_bytes,
        max_image_pixels=max_image_pixels,
        cors_origins=origins,
        model_path=_path(os.getenv("MODEL_PATH")),
        labels_path=_path(os.getenv("MODEL_LABELS_PATH")),
        image_normalization=normalization,
    )
