const express = require('express');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ingestSensorData, getLiveData } = require('../controllers/sensorController');
const { register, login } = require('../controllers/authController');
const { updateSetting } = require('../controllers/settingsController');
const { sensorSchema, registerSchema, loginSchema, settingSchema } = require('./schemas');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/login', validate(loginSchema), login);

router.post('/sensors/ingest', authenticate, authorize('admin', 'user'), validate(sensorSchema), ingestSensorData);
router.get('/sensors/live', authenticate, authorize('admin', 'user'), getLiveData);

router.put('/settings', authenticate, authorize('admin'), validate(settingSchema), updateSetting);

module.exports = router;
