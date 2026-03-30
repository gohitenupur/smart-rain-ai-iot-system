const { listAlerts } = require('../services/alertService');

async function getAlerts(req, res, next) {
  try {
    const alerts = await listAlerts(20);
    return res.json(alerts);
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAlerts };
