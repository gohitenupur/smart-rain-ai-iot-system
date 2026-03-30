const pool = require('../config/db');

async function createAlert({ alertType, message, severity = 'info' }) {
  const { rows } = await pool.query(
    `INSERT INTO alerts (alert_type, message, severity)
     VALUES ($1, $2, $3)
     RETURNING *;`,
    [alertType, message, severity]
  );
  return rows[0];
}

async function listAlerts(limit = 20) {
  const { rows } = await pool.query(
    `SELECT * FROM alerts ORDER BY created_at DESC LIMIT $1;`,
    [limit]
  );
  return rows;
}

module.exports = { createAlert, listAlerts };
