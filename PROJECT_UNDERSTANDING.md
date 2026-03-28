# Smart Rain Detection & Prediction System
## Complete Project Understanding & Implementation Guide

---

## 📋 PROJECT SUMMARY

A **production-ready IoT system** that combines:
- **Real-time sensor data collection** from IoT devices
- **AI-powered rain detection** using machine learning
- **Rainfall prediction** using time-series models
- **Automated actions** (alerts, window control, irrigation shutdown)
- **Interactive dashboard** for monitoring and analytics

**Target Users**: Farmers, homeowners, smart building managers

---

## 🏛️ SYSTEM ARCHITECTURE

### Data Flow
```
IoT Sensors (Temperature, Humidity, Pressure, Rain)
    ↓
Microcontroller (ESP32/Arduino/Raspberry Pi)
    ↓
REST API (Node.js/Express)
    ↓
AI/ML Models (Python/scikit-learn)
    ↓
PostgreSQL Database
    ↓
React Dashboard (Real-time visualization)
    ↓
Automation Triggers (Alerts, Servo Motor, Irrigation)
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **IoT/Hardware** | ESP32, Arduino, DHT11, Rain Sensor | Physical data collection |
| **Backend** | Node.js, Express.js | API & business logic |
| **Database** | PostgreSQL | Persistent data storage |
| **AI/ML** | Python, scikit-learn, TensorFlow | Predictions & classification |
| **Frontend** | React.js, Recharts | User interface & visualization |
| **DevOps** | Docker, Docker Compose | Containerization & deployment |

---

## 📁 PROJECT STRUCTURE EXPLAINED

```
smart-rain-ai-iot-system/
│
├── backend/                          # Node.js REST API (Port 4000)
│   ├── src/
│   │   ├── app.js                   # Express app initialization
│   │   ├── server.js                # Entry point, starts server
│   │   ├── config/
│   │   │   ├── db.js               # PostgreSQL connection pool
│   │   │   └── env.js              # Environment variables loader
│   │   ├── controllers/
│   │   │   ├── authController.js   # User authentication logic
│   │   │   ├── sensorController.js # Sensor data handlers
│   │   │   └── predictionController.js # AI prediction endpoints
│   │   ├── services/
│   │   │   ├── sensorService.js    # Sensor data processing
│   │   │   ├── predictionService.js # ML inference & predictions
│   │   │   ├── alertService.js     # Alert generation & automation
│   │   │   └── deviceService.js    # Device management
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT authentication check
│   │   │   ├── errorHandler.js     # Global error handling
│   │   │   └── validate.js         # Input validation (Joi)
│   │   ├── routes/
│   │   │   ├── index.js            # Route aggregation
│   │   │   └── schemas.js          # Joi validation schemas
│   │   └── utils/
│   │       └── errors.js           # Custom error classes
│   ├── tests/
│   │   └── api.test.js             # Jest unit tests
│   ├── package.json                # Dependencies
│   ├── .env.example                # Environment template
│   └── Dockerfile                  # Container image
│
├── frontend/                         # React Dashboard (Port 3000)
│   ├── src/
│   │   ├── App.js                  # Main React component
│   │   ├── index.js                # React entry point
│   │   ├── components/
│   │   │   ├── SensorChart.js      # Real-time sensor graphs
│   │   │   ├── AlertPanel.js       # Alert display
│   │   │   ├── PredictionCard.js   # Rain prediction display
│   │   │   └── Dashboard.js        # Main dashboard layout
│   │   └── services/
│   │       └── api.js              # Axios HTTP client
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── package.json                # Dependencies
│   ├── .env.example                # Environment template
│   └── Dockerfile                  # Container image
│
├── ai/                              # Machine Learning Models
│   ├── train.py                    # Model training script
│   │   └── Trains two models:
│   │       ├── rain_detector.joblib (Logistic Regression)
│   │       └── rain_forecaster.joblib (Random Forest Regressor)
│   ├── inference.py                # Model inference interface
│   │   └── Called by backend via subprocess
│   ├── data/
│   │   └── weather_sample.csv      # Sample training dataset
│   ├── models/                     # Trained model files (auto-generated)
│   ├── tests/
│   │   └── test_inference.py       # Model testing
│   ├── requirements.txt            # Python dependencies
│   └── venv/                       # Virtual environment (optional)
│
├── database/
│   └── schema.sql                  # PostgreSQL database schema
│       Tables:
│       ├── users (Authentication)
│       ├── devices (IoT devices)
│       ├── sensor_data (Raw readings)
│       ├── predictions (ML predictions)
│       ├── alerts (Alert history)
│       └── system_settings (Configuration)
│
├── iot-simulator/
│   └── send_mock_data.js          # Simulates IoT sensor data
│                                   └── Sends to backend API for testing
│
├── mock-data/
│   └── sensor_payload.json        # Sample sensor data format
│
├── docs/
│   └── API.md                      # Complete API documentation
│
├── docker-compose.yml              # Multi-container orchestration
│                                   ├── postgres service
│                                   ├── backend service
│                                   └── frontend service
│
├── SETUP_GUIDE.md                  # Complete setup instructions
├── setup.sh                        # Linux/macOS setup script
├── setup.ps1                       # Windows setup script
└── README.md                       # Project overview
```

---

## 🔧 HOW EACH COMPONENT WORKS

### 1. Backend API (Node.js/Express)
**File**: `backend/src/server.js`

```javascript
// Receives sensor data from IoT devices
POST /api/v1/sensors/data
{
  "device_id": "sensor-001",
  "temperature_c": 25.5,
  "humidity_pct": 65,
  "pressure_hpa": 1013.25,
  "rain_analog": 512
}

// Stores in PostgreSQL database
// Calls AI model for rain detection
// Triggers alerts if rain detected
```

### 2. AI Model Pipeline (Python)
**File**: `ai/train.py` → `ai/inference.py`

```python
# Training Phase (train.py)
1. Load weather_sample.csv
2. Extract features: [temperature, humidity, pressure, rain_analog]
3. Train two models:
   a) Logistic Regression → Rain detection (Yes/No)
   b) Random Forest Regressor → Rainfall amount prediction
4. Save models as joblib files

# Inference Phase (inference.py)
1. Load trained models
2. Accept sensor data from backend (Node.js)
3. Make predictions
4. Return results: {"raining": true, "confidence": 0.95}
```

### 3. Frontend Dashboard (React)
**File**: `frontend/src/App.js`

```jsx
Features:
- Real-time sensor readings (temperature, humidity, pressure)
- Line charts using Recharts
- Current rain detection status
- Rainfall prediction (next 1-3 hours)
- Alert history with timestamps
- Manual control (simulate automation actions)
```

### 4. Database (PostgreSQL)
**File**: `database/schema.sql`

```sql
-- Tables auto-created on first Docker run
CREATE TABLE sensor_data (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(255),
  temperature_c FLOAT,
  humidity_pct FLOAT,
  pressure_hpa FLOAT,
  rain_analog INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE predictions (
  id SERIAL PRIMARY KEY,
  is_raining BOOLEAN,
  confidence FLOAT,
  predicted_rainfall_mm FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50),  -- 'RAIN_DETECTED', 'AUTOMATION_TRIGGERED'
  message TEXT,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. IoT Simulator
**File**: `iot-simulator/send_mock_data.js`

```javascript
// Simulates real IoT sensors
// Sends periodic data to backend
// Useful for testing without hardware

node send_mock_data.js
// Sends HTTP POST requests every 5 seconds
// Frontend/Backend responds with predictions & alerts
```

---

## 🚀 COMPLETE SETUP & RUNNING GUIDE

### **Option A: Docker (Recommended - All-in-one)**

**Prerequisites**: Docker Desktop running

```bash
cd smart-rain-ai-iot-system
docker compose up --build

# Services will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:4000/api/v1
# Database: localhost:5432
```

**Note**: Docker daemon not running on this system, so use Option B

### **Option B: Manual Local Setup (Current Status)**

✅ **What's been done**:
- Backend dependencies installed (express, pg, jwt, etc.)
- Frontend dependencies installed (react, recharts, axios, etc.)

#### **Step 1: PostgreSQL Database**
```bash
# Install PostgreSQL 14+
# Create database
createdb smart_rain

# Load schema
psql -U postgres -d smart_rain -f database/schema.sql
```

#### **Step 2: Environment Configuration**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your DB credentials

# Frontend
cp frontend/.env.example frontend/.env
```

#### **Step 3: Train AI Models**
```bash
cd ai

# Create Python virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Train models
python train.py
# Generates: models/rain_detector.joblib and rain_forecaster.joblib
```

#### **Step 4: Start Backend**
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload

# Listening on http://localhost:4000
# API endpoints available at http://localhost:4000/api/v1
```

#### **Step 5: Start Frontend**
```bash
cd frontend
npm start

# Opens http://localhost:3000 automatically
# React development server with hot-reload
```

#### **Step 6: Send Mock Data (Testing)**
```bash
cd iot-simulator
node send_mock_data.js

# Simulates sensor data and sends to backend
# Test predictions and alerts
```

---

## 📊 API ENDPOINTS REFERENCE

### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### Sensor Data
```
POST /api/v1/sensors/data          # Submit sensor reading
GET  /api/v1/sensors/history       # Get past readings
```

### Predictions
```
POST /api/v1/predictions/detect    # Detect rain now
POST /api/v1/predictions/forecast  # Predict next 3 hours
GET  /api/v1/predictions/history   # Get prediction history
```

### Alerts
```
GET  /api/v1/alerts                # Get all alerts
POST /api/v1/alerts/acknowledge    # Mark alert as read
DELETE /api/v1/alerts/:id          # Delete alert
```

### Devices (IoT)
```
POST /api/v1/devices/register      # Register new device
GET  /api/v1/devices               # List all devices
PUT  /api/v1/devices/:id           # Update device
DELETE /api/v1/devices/:id         # Remove device
```

### Settings
```
GET  /api/v1/settings              # Get system config
PUT  /api/v1/settings              # Update thresholds
```

---

## 🧪 TESTING

### Backend Tests
```bash
cd backend
npm test

# Runs Jest test suite
# Tests API endpoints, auth, validation
```

### AI Model Tests
```bash
cd ai

# Activate venv first
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run tests
pytest tests/test_inference.py
```

### Manual API Testing (Postman)
```bash
# Detect rain with sample data
POST http://localhost:4000/api/v1/predictions/detect
Content-Type: application/json

{
  "temperature_c": 22.5,
  "humidity_pct": 75,
  "pressure_hpa": 1009.5,
  "rain_analog": 600
}

# Response:
{
  "is_raining": true,
  "confidence": 0.92,
  "predicted_rainfall_mm": 35.2
}
```

---

## 🔐 SECURITY FEATURES

✅ **Implemented**:
- JWT-based authentication (jsonwebtoken)
- Input validation with Joi
- Helmet.js for HTTP header security
- CORS protection
- Environment variables (no hardcoded secrets)
- SQL injection prevention (parameterized queries with pg)
- Role-based access control (admin/user)

---

## 📈 KEY FEATURES EXPLAINED

### 1. Real-Time Data Collection
- Sensors send data every 5-10 seconds
- Backend receives and validates
- Stores in PostgreSQL
- Frontend subscribes to updates

### 2. Rain Detection
- Logistic Regression model
- Analyzes 4 features: temp, humidity, pressure, rain_analog
- Outputs binary classification: "Rain" or "No Rain"
- Confidence score: 0-1

### 3. Rainfall Prediction
- Random Forest Regressor (time-series)
- Predicts rainfall amount (mm) for next 1-3 hours
- Uses historical patterns
- Updates every sensor reading

### 4. Automation Triggers
When rain detected:
1. **Alert**: Both console log + database
2. **Browser Notification**: Push to frontend
3. **Servo Motor Simulation**: Logs action to close window
4. **Irrigation Shutdown**: Logs stop signal

Example in `alertService.js`:
```javascript
if (prediction.is_raining) {
  // Send alert
  await sendAlert("RAIN_DETECTED", `Rain detected with ${confidence}% confidence`);
  
  // Trigger automation
  console.log("[AUTOMATION] Closing window via servo motor");
  console.log("[AUTOMATION] Stopping irrigation system");
}
```

### 5. Dashboard Visualization
- Real-time line charts (Recharts)
- Temperature/Humidity/Pressure trends
- Current rain status indicator
- Alert list with timestamps
- Manual override buttons

---

## 🎯 WORKFLOW EXAMPLE

### Scenario: A farmer using Smart Rain System

```
9:00 AM - Farmer opens dashboard at http://localhost:3000
         ✓ Sees real-time sensor data from field

9:15 AM - Rain sensor detects moisture
         Backend API receives: {rain_analog: 780}
         ✓ AI model deticts: "Rain detected" (92% confidence)
         ✓ Prediction model forecasts: "35mm rainfall expected"

9:16 AM - System triggers automation
         ✓ Dashboard shows red alert: "RAIN ALERT!"
         ✓ Console logs: "[AUTOMATION] Closing window via servo"
         ✓ Console logs: "[AUTOMATION] Stopping irrigation"
         ✓ Browser notification sent to farmer

9:30 AM - Farmer checks history in dashboard
         ✓ Sees all sensor readings from past hour
         ✓ Sees all predictions and confidence scores
         ✓ Sees automation actions taken

Result: Farmer's crops protected, irrigation saved, no manual intervention needed!
```

---

## 🚨 TROUBLESHOOTING

### Backend won't start
```bash
# Check port 4000 is available
# Check PostgreSQL is running
psql -U postgres -l  # List databases

# Check backend/.env has correct DB credentials
cat backend/.env
```

### AI models not found error
```bash
# Regenerate models
cd ai
python train.py

# Verify models exist
ls models/
```

### Frontend can't connect to API
```bash
# Verify backend is running
curl http://localhost:4000/api/v1

# Check frontend/.env has correct API URL
cat frontend/.env

# Check CORS is enabled in backend (it is by default)
```

### npm install fails
```bash
npm cache clean --force
rm package-lock.json
npm install --legacy-peer-deps
```

---

## 📚 LEARNING OUTCOMES

After completing this project, you'll understand:

✅ **IoT Concepts**: Sensor data collection, microcontroller integration
✅ **Backend Development**: REST APIs, authentication, database design
✅ **Machine Learning**: Model training, inference, predictions
✅ **Frontend Development**: React, real-time dashboards, visualization
✅ **DevOps**: Docker, environment management, deployment
✅ **Full-Stack Integration**: Connecting all components together

---

## 🎓 NEXT STEPS

1. **Complete Setup**: Follow Option B steps (already started)
2. **Start Services**: Backend → Frontend → Test
3. **Send Mock Data**: Use IoT simulator
4. **Verify Predictions**: Check API responses
5. **Explore Code**: Read comments in source files
6. **Customize**: Adjust ML model parameters
7. **Deploy**: Push to Render, Vercel, or cloud platforms

---

## 📞 QUICK CHECKLIST

- [ ] Backend node_modules installed ✅
- [ ] Frontend node_modules installed ✅
- [ ] Environment files created ✅
- [ ] PostgreSQL database created (Next)
- [ ] AI models trained (Next)
- [ ] Backend started on :4000 (Next)
- [ ] Frontend started on :3000 (Next)
- [ ] Mock data sent (Next)
- [ ] Dashboard working (Next)
- [ ] Predictions tested (Next)

---

**Happy Coding! 🚀**
