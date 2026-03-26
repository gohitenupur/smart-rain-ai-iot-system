const pool = require('../config/db');

async function upsertDevice({ deviceId, name, location }) {
  const query = `
    INSERT INTO devices (device_id, name, location)
    VALUES ($1, $2, $3)
    ON CONFLICT (device_id)
    DO UPDATE SET name = EXCLUDED.name, location = EXCLUDED.location, updated_at = NOW()
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [deviceId, name, location]);
  return rows[0];
}

module.exports = { upsertDevice };
