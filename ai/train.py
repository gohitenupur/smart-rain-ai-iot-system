"""Train rain detection + short-term rainfall prediction models."""

from pathlib import Path
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "weather_sample.csv"
MODELS_DIR = BASE_DIR / "models"


def train_models() -> dict:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(DATA_FILE)

    features = ["temperature_c", "humidity_pct", "pressure_hpa", "rain_analog"]

    x = df[features]
    y_detect = df["is_raining"]

    x_train, x_test, y_train, y_test = train_test_split(
        x, y_detect, test_size=0.2, random_state=42
    )

    detector = RandomForestClassifier(n_estimators=120, random_state=42)
    detector.fit(x_train, y_train)
    detect_pred = detector.predict(x_test)
    detect_acc = accuracy_score(y_test, detect_pred)

    regressor = RandomForestRegressor(n_estimators=150, random_state=42)
    regressor.fit(x, df[["rain_1h_mm", "rain_2h_mm", "rain_3h_mm"]])
    reg_pred = regressor.predict(x_test)
    reg_mae = mean_absolute_error(df.loc[y_test.index, ["rain_1h_mm", "rain_2h_mm", "rain_3h_mm"]], reg_pred)

    joblib.dump(detector, MODELS_DIR / "rain_detector.joblib")
    joblib.dump(regressor, MODELS_DIR / "rain_forecaster.joblib")

    return {"detector_accuracy": float(detect_acc), "forecast_mae": float(reg_mae)}


if __name__ == "__main__":
    metrics = train_models()
    print(metrics)
