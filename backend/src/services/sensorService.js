const pool = require('../config/db');

async function createSensorData(payload) {
  const query = `
    INSERT INTO sensor_data (device_id, temperature_c, humidity_pct, pressure_hpa, rain_analog, captured_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    payload.deviceId,
    payload.temperatureC,
    payload.humidityPct,
    payload.pressureHpa,
    payload.rainAnalog,
    payload.capturedAt
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function listLatestSensorData(limit = 20) {
  const { rows } = await pool.query(
    `SELECT * FROM sensor_data ORDER BY captured_at DESC LIMIT $1;`,
    [limit]
  );
  return rows;
}

module.exports = { createSensorData, listLatestSensorData };
