#!/usr/bin/env sh
set -e

cd /app

# Train models once if artifacts are missing.
if [ ! -f /app/ai/models/rain_detector.joblib ] || [ ! -f /app/ai/models/rain_forecaster.joblib ]; then
  echo "[startup] Training AI models..."
  python3 /app/ai/train.py
else
  echo "[startup] Existing AI model artifacts found, skipping training."
fi

cd /app/backend
exec node src/server.js
