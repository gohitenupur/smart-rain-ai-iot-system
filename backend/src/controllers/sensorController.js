const { upsertDevice } = require('../services/deviceService');
const { createSensorData, listLatestSensorData } = require('../services/sensorService');
const { getSystemSetting } = require('../services/settingsService');
const { createAlert } = require('../services/alertService');
const { detectRain, predictRainfall, savePrediction } = require('../services/predictionService');

async function ingestSensorData(req, res, next) {
  try {
    const data = req.body;
    await upsertDevice({
      deviceId: data.deviceId,
      name: data.deviceName || data.deviceId,
      location: data.location || 'Unknown'
    });

    const sensorRecord = await createSensorData(data);
    const features = {
      temperature_c: data.temperatureC,
      humidity_pct: data.humidityPct,
      pressure_hpa: data.pressureHpa,
      rain_analog: data.rainAnalog
    };

    const detection = await detectRain(features);
    const forecast = await predictRainfall(features);

    const prediction = await savePrediction({
      sensorDataId: sensorRecord.id,
      predictedRain: detection.label === 'Rain',
      rainProbability: detection.probability,
      forecast1h: forecast.forecast_1h_mm,
      forecast2h: forecast.forecast_2h_mm,
      forecast3h: forecast.forecast_3h_mm
    });

    const threshold = Number(await getSystemSetting('rain_alert_threshold', '0.6'));
    let alert = null;

    if (detection.probability >= threshold) {
      alert = await createAlert({
        alertType: 'rain_detected',
        severity: detection.probability > 0.85 ? 'high' : 'medium',
        message: `Rain risk high (${(detection.probability * 100).toFixed(1)}%). Trigger automation.`
      });

      // Simulate automation for servo + irrigation controller.
      // eslint-disable-next-line no-console
      console.log('[AUTOMATION] Closing windows and pausing irrigation.');
    }

    return res.status(201).json({
      sensorRecord,
      prediction,
      detection,
      forecast,
      alert
    });
  } catch (error) {
    return next(error);
  }
}

async function getLiveData(req, res, next) {
  try {
    const rows = await listLatestSensorData(30);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

module.exports = { ingestSensorData, getLiveData };
