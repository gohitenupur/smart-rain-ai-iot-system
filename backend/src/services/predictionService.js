const { spawn } = require('child_process');
const path = require('path');
const pool = require('../config/db');
const env = require('../config/env');

function runPythonModel(command, payload) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../../../ai/inference.py');
    const python = spawn(env.pythonExecutable, [scriptPath, command, JSON.stringify(payload)]);

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    python.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python inference failed: ${stderr}`));
      }

      try {
        return resolve(JSON.parse(stdout));
      } catch (error) {
        return reject(new Error(`Invalid model output: ${stdout}`));
      }
    });
  });
}

async function detectRain(features) {
  return runPythonModel('detect', features);
}

async function predictRainfall(features) {
  return runPythonModel('predict', features);
}

async function savePrediction({ sensorDataId, predictedRain, rainProbability, forecast1h, forecast2h, forecast3h }) {
  const query = `
    INSERT INTO predictions (
      sensor_data_id, predicted_rain, rain_probability, forecast_1h_mm, forecast_2h_mm, forecast_3h_mm
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [
    sensorDataId,
    predictedRain,
    rainProbability,
    forecast1h,
    forecast2h,
    forecast3h
  ]);
  return rows[0];
}

module.exports = { detectRain, predictRainfall, savePrediction };
