const pool = require('../config/db');

async function getSystemSetting(key, defaultValue) {
  const { rows } = await pool.query(
    'SELECT setting_value FROM system_settings WHERE setting_key = $1 LIMIT 1;',
    [key]
  );

  if (!rows.length) return defaultValue;
  return rows[0].setting_value;
}

module.exports = { getSystemSetting };
