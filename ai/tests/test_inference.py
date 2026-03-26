from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from inference import run  # noqa: E402


def test_detect_output_shape():
    payload = {
        "temperature_c": 24,
        "humidity_pct": 82,
        "pressure_hpa": 1002,
        "rain_analog": 760,
    }
    out = run("detect", payload)
    assert out["label"] in ["Rain", "No Rain"]
    assert 0.0 <= out["probability"] <= 1.0


def test_predict_output_shape():
    payload = {
        "temperature_c": 29,
        "humidity_pct": 65,
        "pressure_hpa": 1008,
        "rain_analog": 380,
    }
    out = run("predict", payload)
    assert "forecast_1h_mm" in out
    assert "forecast_2h_mm" in out
    assert "forecast_3h_mm" in out
