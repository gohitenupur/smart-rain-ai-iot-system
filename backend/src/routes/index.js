const express = require('express');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ingestSensorData, getLiveData } = require('../controllers/sensorController');
const { register, login } = require('../controllers/authController');
const { updateSetting } = require('../controllers/settingsController');
const { getAlerts } = require('../controllers/alertController');
const { sensorSchema, registerSchema, loginSchema, settingSchema } = require('./schemas');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/login', validate(loginSchema), login);

// IoT devices send sensor data without authentication (they use device_id for identification)
router.post('/sensors/ingest', validate(sensorSchema), ingestSensorData);
router.get('/sensors/live', authenticate, authorize('admin', 'user'), getLiveData);

router.get('/alerts', authenticate, authorize('admin', 'user'), getAlerts);

router.put('/settings', authenticate, authorize('admin'), validate(settingSchema), updateSetting);

module.exports = router;

