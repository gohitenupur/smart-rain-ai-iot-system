# Smart Rain Detection & Prediction System - Setup Guide

## Project Overview

A production-ready IoT system that:
- Collects real-time sensor data (temperature, humidity, pressure, rain)
- Detects rain using AI models
- Predicts future rainfall using ML models
- Triggers automation (alerts, servo motors, irrigation control)
- Displays data in a real-time React dashboard

## Architecture

```
Sensors → Microcontroller (ESP32/Arduino) → Backend API → AI Model → PostgreSQL → React Dashboard
```

### Tech Stack
- **Backend**: Node.js + Express.js
- **Frontend**: React.js with Recharts
- **AI/ML**: Python (scikit-learn)
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

---

## Quick Start (Option 1: Docker - RECOMMENDED)

### Prerequisites
- Docker Desktop installed and running
- 8GB RAM minimum

### Steps
```bash
cd smart-rain-ai-iot-system
docker compose up --build
```

### Access Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/v1
- **PostgreSQL**: localhost:5432

---

## Manual Setup (Option 2: Local Development)

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 14+

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 3: Set Up Python Environment for AI/ML
```bash
cd ../ai
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Step 4: Set Up Environment Variables

Create `.env` files:

**backend/.env**
```
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=smart_rain
PYTHON_EXECUTABLE=python
```

**frontend/.env** (optional, create if needed)
```
REACT_APP_API_URL=http://localhost:4000/api/v1
```

### Step 5: Set Up PostgreSQL Database

1. Create database:
```bash
createdb smart_rain
```

2. Run schema:
```bash
psql -U postgres -d smart_rain -f database/schema.sql
```

### Step 6: Train AI Models

```bash
cd ai
python train.py
```

This generates:
- `models/rain_detector.joblib` (Logistic Regression model)
- `models/rain_forecaster.joblib` (Random Forest model)

### Step 7: Start Backend
```bash
cd backend
npm run dev
```

Backend runs on: **http://localhost:4000**

### Step 8: Start Frontend
```bash
cd frontend
npm start
```

Frontend runs on: **http://localhost:3000**

---

## Project Structure

```
smart-rain-ai-iot-system/
├── backend/                    # Node.js API
│   ├── src/
│   │   ├── app.js             # Express app setup
│   │   ├── server.js          # Server entry point
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   └── utils/             # Helper functions
│   ├── tests/                 # Jest unit tests
│   └── Dockerfile
│
├── frontend/                   # React Dashboard
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API communication
│   │   └── App.js
│   ├── public/
│   └── Dockerfile
│
├── ai/                        # ML Models
│   ├── train.py              # Train models
│   ├── inference.py          # Model inference
│   ├── data/                 # Training data
│   ├── models/               # Trained models (joblib)
│   ├── tests/                # ML unit tests
│   └── requirements.txt
│
├── database/                  # Database
│   └── schema.sql            # PostgreSQL schema
│
├── iot-simulator/            # Mock sensor data
│   └── send_mock_data.js     # Simulates IoT device
│
├── mock-data/
│   └── sensor_payload.json   # Sample sensor data
│
├── docker-compose.yml        # Docker orchestration
└── .env files               # Environment configuration
```

---

## Core Features Implementation

### 1. Sensor Data Ingestion
**Endpoint**: `POST /api/v1/sensors/data`

Receives sensor data from IoT devices:
```json
{
  "device_id": "sensor-001",
  "temperature_c": 25.5,
  "humidity_pct": 65,
  "pressure_hpa": 1013.25,
  "rain_analog": 512
}
```

### 2. Rain Detection
**Endpoint**: `POST /api/v1/predictions/detect`

Uses trained Logistic Regression model to classify: Rain vs No Rain

### 3. Rain Prediction
**Endpoint**: `POST /api/v1/predictions/forecast`

Predicts rainfall for next 1-3 hours using time-series model

### 4. Alerts & Automation
**Service**: `alertService.js`

Triggers automation when rain detected:
- Send browser notifications
- Log alerts to database
- Simulate servo motor action (close windows)
- Stop irrigation system

### 5. Real-Time Dashboard
**Frontend**: React components showing:
- Live sensor readings
- Temperature/Humidity/Pressure graphs
- Rain detection status
- Alert history

---

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user

### Sensors
- `POST /api/v1/sensors/data` - Submit sensor data
- `GET /api/v1/sensors/history` - Get sensor history

### Predictions  
- `POST /api/v1/predictions/detect` - Detect rain now
- `POST /api/v1/predictions/forecast` - Predict next 3 hours
- `GET /api/v1/predictions/history` - Get prediction history

### Alerts
- `GET /api/v1/alerts` - Get all alerts
- `POST /api/v1/alerts/acknowledge` - Mark alert as read

### Settings
- `GET /api/v1/settings` - Get system settings
- `PUT /api/v1/settings` - Update thresholds

---

## Testing

### Backend Unit Tests
```bash
cd backend
npm test
```

### AI Model Tests
```bash
cd ai
python -m pytest tests/
```

### Manual API Testing
Use Postman or curl:
```bash
curl -X POST http://localhost:4000/api/v1/predictions/detect \
  -H "Content-Type: application/json" \
  -d '{
    "temperature_c": 22,
    "humidity_pct": 70,
    "pressure_hpa": 1010,
    "rain_analog": 600
  }'
```

---

## Database Schema

### Tables
1. **users** - System users with role-based access
2. **devices** - Connected IoT devices
3. **sensor_data** - Raw sensor readings
4. **predictions** - AI predictions (rain yes/no + forecast)
5. **alerts** - Triggered alerts
6. **system_settings** - Configurable thresholds

---

## Deployment

### Backend (Render/Railway)
```bash
git push origin main
# CI/CD automatically deploys
```

### Frontend (Vercel)
```bash
vercel --prod
```

### Database (Supabase/Neon)
```bash
# Cloud PostgreSQL provider
```

---

## Troubleshooting

### Issue: `npm install` fails in frontend
**Solution**:
```bash
npm cache clean --force
rm package-lock.json
npm install --legacy-peer-deps
```

### Issue: Python models not found
**Solution**:
```bash
cd ai
python train.py  # Regenerate models
```

### Issue: Backend can't connect to PostgreSQL
**Solution**:
```bash
# Check PostgreSQL is running
psql -U postgres -d smart_rain

# Verify .env credentials
cat backend/.env
```

### Issue: React app won't start
**Solution**:
```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

---

## Development Workflow

1. **Code locally** on your machine
2. **Test each layer separately**:
   - API: Postman
   - ML: Python scripts
   - Frontend: Browser dev tools
3. **Commit changes**: `git commit -m "Feature: ..."`
4. **Push to GitHub**: `git push origin main`
5. **Deploy**: Docker compose or cloud platforms

---

## Performance Optimization

1. **Model Caching**: Models loaded once at startup
2. **Database Indexes**: Created on frequently queried columns
3. **API Rate Limiting**: Prevent abuse
4. **Frontend Compression**: Minified React bundle
5. **Connection Pooling**: PostgreSQL connection pool

---

## Security Best Practices

✅ JWT-based authentication
✅ Input validation with Joi
✅ Helmet.js for HTTP headers
✅ CORS protection
✅ No hardcoded secrets (use .env)
✅ SQL injection prevention (parameterized queries)
✅ Role-based access control

---

## Next Steps

1. ✅ Read this guide
2. ✅ Choose setup option (Docker or Manual)
3. ✅ Install dependencies
4. ✅ Train AI models
5. ✅ Start all services
6. ✅ Visit dashboard at http://localhost:3000
7. ✅ Send mock sensor data
8. ✅ Verify predictions and alerts

---

## Support & Documentation

- **API Docs**: See [docs/API.md](docs/API.md)
- **Backend Config**: [backend/src/config/](backend/src/config/)
- **ML Training**: [ai/train.py](ai/train.py)
- **Database Schema**: [database/schema.sql](database/schema.sql)

---

**Happy Building! 🚀**
