import json
import logging
import os
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image


logger = logging.getLogger(__name__)


class DiseaseModel:
    def __init__(
        self,
        model_path: Path | None,
        labels_path: Path | None,
        normalization: str,
    ) -> None:
        self.model: Any = None
        self.labels: list[str] = []
        self.normalization = normalization
        self.error: str | None = None

        if model_path is None or labels_path is None:
            self.error = "MODEL_PATH and MODEL_LABELS_PATH are not configured."
            return
        if not model_path.is_file() or not labels_path.is_file():
            self.error = "The configured model or class-label file does not exist."
            return

        try:
            labels_data = json.loads(labels_path.read_text(encoding="utf-8"))
            if (
                not isinstance(labels_data, list)
                or not labels_data
                or not all(isinstance(label, str) and label.strip() for label in labels_data)
            ):
                raise ValueError("The model labels file must contain a non-empty JSON array of strings.")
            self.labels = labels_data

            # Set TensorFlow's native logging and oneDNN controls before its first import.
            os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
            os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")
            import tensorflow as tf

            self.model = tf.keras.models.load_model(model_path, compile=False)
            output_shape = self.model.output_shape
            if isinstance(output_shape, list) or len(output_shape) != 2:
                raise ValueError("The model must have one batch of class-score outputs.")
            if output_shape[-1] != len(self.labels):
                raise ValueError(
                    "The model output size does not match the number of configured labels."
                )
        except Exception as exc:
            logger.exception("Disease model could not be loaded.")
            self.model = None
            self.error = f"Model unavailable ({type(exc).__name__})."

    @property
    def available(self) -> bool:
        return self.model is not None

    def predict(self, image: Image.Image) -> list[float]:
        if self.model is None:
            raise RuntimeError(self.error or "Disease model is unavailable.")

        input_shape = self.model.input_shape
        if isinstance(input_shape, list) or len(input_shape) != 4:
            raise RuntimeError("The model must accept a single image batch in NHWC format.")
        height = int(input_shape[1] or 224)
        width = int(input_shape[2] or 224)
        if input_shape[3] not in (None, 3):
            raise RuntimeError("The model must accept three-channel RGB images.")

        resized = image.convert("RGB").resize((width, height), Image.Resampling.BILINEAR)
        pixels = np.asarray(resized, dtype=np.float32)
        if self.normalization == "0_1":
            pixels /= 255.0
        else:
            pixels = pixels / 127.5 - 1.0

        raw_scores = np.asarray(
            self.model.predict(np.expand_dims(pixels, axis=0), verbose=0),
            dtype=np.float64,
        )
        if raw_scores.shape != (1, len(self.labels)):
            raise RuntimeError("The model returned an unexpected prediction shape.")
        scores = raw_scores[0]
        if not np.isfinite(scores).all():
            raise RuntimeError("The model returned non-finite prediction scores.")

        if (
            np.all(scores >= 0)
            and np.all(scores <= 1)
            and np.isclose(scores.sum(), 1.0, atol=1e-3)
        ):
            probabilities = scores
        else:
            shifted = scores - np.max(scores)
            exp_scores = np.exp(shifted)
            probabilities = exp_scores / exp_scores.sum()

        return probabilities.astype(float).tolist()
