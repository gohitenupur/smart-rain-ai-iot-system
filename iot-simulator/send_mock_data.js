/**
 * Simple script to simulate ESP32 posting sensor data every N seconds.
 */
const fs = require('fs');
const path = require('path');

const API_BASE = process.env.API_BASE || 'http://localhost:4000/api/v1';
const TOKEN = process.env.JWT_TOKEN || '';
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 8000);

const payloadPath = path.resolve(__dirname, '../mock-data/sensor_payload.json');

async function postReading() {
  const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));

  // Add slight random jitter to mimic sensor changes.
  payload.temperatureC = +(payload.temperatureC + (Math.random() - 0.5) * 1.5).toFixed(2);
  payload.humidityPct = +(payload.humidityPct + (Math.random() - 0.5) * 2.8).toFixed(2);
  payload.pressureHpa = +(payload.pressureHpa + (Math.random() - 0.5) * 1.2).toFixed(2);
  payload.rainAnalog = +(payload.rainAnalog + (Math.random() - 0.5) * 30).toFixed(2);
  payload.capturedAt = new Date().toISOString();

  const res = await fetch(`${API_BASE}/sensors/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  // eslint-disable-next-line no-console
  console.log(new Date().toISOString(), res.status, data.detection || data.error);
}

setInterval(() => {
  postReading().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Simulation error', error.message);
  });
}, INTERVAL_MS);
