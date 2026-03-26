const pool = require('../config/db');

async function updateSetting(req, res, next) {
  try {
    const { settingKey, settingValue } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO system_settings (setting_key, setting_value)
       VALUES ($1, $2)
       ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = NOW()
       RETURNING *;`,
      [settingKey, settingValue]
    );

    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

module.exports = { updateSetting };
