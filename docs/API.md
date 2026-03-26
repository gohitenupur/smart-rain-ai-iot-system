# Smart Rain API Documentation

Base URL: `http://localhost:4000/api/v1`

## Auth

### POST `/auth/register`
Register admin/user.

```json
{
  "email": "admin@example.com",
  "password": "StrongPass123",
  "role": "admin"
}
```

### POST `/auth/login`
Returns JWT token.

## Sensor Ingestion

### POST `/sensors/ingest`
Headers: `Authorization: Bearer <token>`

```json
{
  "deviceId": "esp32-lab-01",
  "temperatureC": 24.2,
  "humidityPct": 84,
  "pressureHpa": 1002,
  "rainAnalog": 720,
  "capturedAt": "2026-03-26T12:00:00.000Z"
}
```

Response includes:
- persisted sensor row
- rain detection (`Rain` / `No Rain` + probability)
- 1h/2h/3h rainfall forecast
- optional alert when probability >= configurable threshold

## Live Data

### GET `/sensors/live`
Returns latest 30 sensor records.

## Settings

### PUT `/settings`
Admin only. Updates dynamic threshold and other configs.

```json
{
  "settingKey": "rain_alert_threshold",
  "settingValue": "0.65"
}
```
