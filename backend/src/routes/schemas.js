const Joi = require('joi');

const sensorSchema = Joi.object({
  deviceId: Joi.string().required(),
  deviceName: Joi.string().optional(),
  location: Joi.string().optional(),
  temperatureC: Joi.number().min(-50).max(80).required(),
  humidityPct: Joi.number().min(0).max(100).required(),
  pressureHpa: Joi.number().min(850).max(1100).required(),
  rainAnalog: Joi.number().min(0).max(1023).required(),
  capturedAt: Joi.date().iso().required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'user').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const settingSchema = Joi.object({
  settingKey: Joi.string().required(),
  settingValue: Joi.string().required()
});

module.exports = { sensorSchema, registerSchema, loginSchema, settingSchema };
