"""Inference bridge script called by Node.js backend."""

from __future__ import annotations
import json
import sys
from pathlib import Path
import joblib
import numpy as np

MODELS_DIR = Path(__file__).resolve().parent / "models"
DETECTOR_PATH = MODELS_DIR / "rain_detector.joblib"
FORECASTER_PATH = MODELS_DIR / "rain_forecaster.joblib"
FEATURE_ORDER = ["temperature_c", "humidity_pct", "pressure_hpa", "rain_analog"]


def _load_models():
    detector = joblib.load(DETECTOR_PATH)
    forecaster = joblib.load(FORECASTER_PATH)
    return detector, forecaster


def _vectorize(payload: dict) -> np.ndarray:
    return np.array([[float(payload[name]) for name in FEATURE_ORDER]])


def run(command: str, payload: dict) -> dict:
    detector, forecaster = _load_models()
    vector = _vectorize(payload)

    if command == "detect":
        prob = float(detector.predict_proba(vector)[0][1])
        return {
            "label": "Rain" if prob >= 0.5 else "No Rain",
            "probability": round(prob, 4),
        }

    if command == "predict":
        forecast = forecaster.predict(vector)[0]
        return {
            "forecast_1h_mm": round(float(forecast[0]), 3),
            "forecast_2h_mm": round(float(forecast[1]), 3),
            "forecast_3h_mm": round(float(forecast[2]), 3),
        }

    raise ValueError(f"Unsupported command: {command}")


if __name__ == "__main__":
    cmd = sys.argv[1]
    input_payload = json.loads(sys.argv[2])
    print(json.dumps(run(cmd, input_payload)))
