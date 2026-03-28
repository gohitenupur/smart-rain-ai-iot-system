# Smart Rain Detection System - QUICK START GUIDE

## ✅ ALREADY COMPLETED

1. **Backend Dependencies** ✅
   - 416 npm packages installed
   - Express, PostgreSQL driver, JWT, etc. ready

2. **Frontend Dependencies** ✅  
   - React, Recharts, Axios all installed
   - Build system ready

3. **Documentation** ✅
   - Complete project guide created
   - Setup scripts available
   - API documentation ready

---

## 📋 NEXT STEPS (DO THESE IN ORDER)

### Step 1: Set Up PostgreSQL Database (If not already done)

```bash
# Create database
createdb smart_rain

# Option A: Load schema automatically
psql -U postgres -d smart_rain -f database/schema.sql

# Option B: Manual using psql CLI
psql -U postgres -d smart_rain

# Then run:
\i database/schema.sql
```

### Step 2: Create Backend Environment File

```bash
cd backend

# Copy template to actual .env
copy .env.example .env

# Edit with your database credentials (if different from defaults)
notepad .env
```

**Default values are OK for local development:**
```
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=smart_rain
```

### Step 3: Create Frontend Environment File

```bash
cd ../frontend
copy .env.example .env

# You can leave this as-is for local development
```

### Step 4: Train AI Models

```bash
cd ../ai

# Create Python virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Train models (generates .joblib files)
python train.py

# Should output:
# ✓ Rain Detector model trained: 85% accuracy
# ✓ Rain Forecaster model trained: saved
```

### Step 5: Start Backend Server

**Terminal 1:**
```bash
cd backend

# Start with hot-reload (development mode)
npm run dev

# Should show:
# Smart Rain API running on port 4000
```

**Test the backend:**
```bash
# In another terminal, test a health check
curl http://localhost:4000/api/v1

# You should get a response (even if 404 for root)
```

### Step 6: Start Frontend Dashboard

**Terminal 2:**
```bash
cd frontend

# Start React development server
npm start

# Should automatically open:
# http://localhost:3000
```

**You should see:**
- React dashboard loading
- Real-time sensor data display
- Chart components

### Step 7: Send Mock Sensor Data (Testing)

**Terminal 3:**
```bash
cd iot-simulator

# Send simulated sensor data to backend
node send_mock_data.js

# Output every 5 seconds:
# Sending sensor data to backend...
# Response: {is_raining: true/false, confidence: 0.XX}
```

### Step 8: View Results

1. **Frontend Dashboard**: http://localhost:3000
   - See real-time sensor readings
   - Monitor rain detection status
   - View predictions and alerts

2. **Backend Logs**: Terminal 1
   - API requests incoming
   - Predictions being made
   - Alerts being triggered

3. **Database**: Query directly
   ```bash
   psql -U postgres -d smart_rain
   
   # Inside psql:
   \dt  # Show all tables
   SELECT * FROM sensor_data LIMIT 5;
   SELECT * FROM predictions LIMIT 5;
   SELECT * FROM alerts LIMIT 5;
   ```

---

## 🧪 TESTING THE SYSTEM

### Test 1: API Health Check
```bash
curl http://localhost:4000/api/v1
# OR
curl http://localhost:4000/api/v1/health
```

### Test 2: Send Sensor Data
```bash
curl -X POST http://localhost:4000/api/v1/sensors/data ^
  -H "Content-Type: application/json" ^
  -d "{\"temperature_c\": 25, \"humidity_pct\": 65, \"pressure_hpa\": 1013, \"rain_analog\": 500}"
```

### Test 3: Detect Rain
```bash
curl -X POST http://localhost:4000/api/v1/predictions/detect ^
  -H "Content-Type: application/json" ^
  -d "{\"temperature_c\": 20, \"humidity_pct\": 80, \"pressure_hpa\": 1008, \"rain_analog\": 700}"
```

### Test 4: Get Alerts
```bash
curl http://localhost:4000/api/v1/alerts
```

---

## 📊 VERIFY EVERYTHING IS WORKING

When all three services are running, you should see:

```
✓ Backend (Terminal 1):
  Smart Rain API running on port 4000
  
✓ Frontend (Terminal 2):
  Compiled successfully!
  Local: http://localhost:3000
  
✓ IoT Simulator (Terminal 3):
  Sending sensor data...
  Prediction received...
```

On the **Dashboard (http://localhost:3000)**:
- Real-time temperature/humidity charts
- Current rain status (Yes/No)
- Confidence percentage
- Alert list below

---

## 🛠️ COMMON ISSUES & FIXES

### "Cannot find module 'express'"
```bash
# Missing backend dependencies
cd backend && npm install
```

### "Connection refused to localhost:5432"
```bash
# PostgreSQL not running
# Start PostgreSQL service
```

### "Models not found"
```bash
# AI models not trained
cd ai && python train.py
```

### "EADDRINUSE :::4000"
```bash
# Port 4000 is in use
# Either kill the process using port 4000
# Or change PORT in backend/.env
```

### "Cannot GET /"
```bash
# This is normal if accessing root
# API endpoints are at /api/v1/*
```

---

## 📱 DASHBOARD FEATURES

### Real-Time Monitoring
- Live temperature, humidity, pressure charts
- Updates every 5 seconds from sensor data

### Rain Detection
- Binary classifier: "Raining" or "Not Raining"
- Confidence percentage (0-100%)
- Historical predictions

### Alerts
- Alert notifications when rain detected
- Alert history with timestamps
- Acknowledgment tracking

### Automation Status
- Shows actions triggered (servo, irrigation)
- Manual override buttons (for testing)

---

## 🚀 NEXT ADVANCED STEPS

Once basic system is working:

1. **Connect Real Hardware**
   - Wire ESP32/Arduino sensors
   - Update IoT simulator with real data stream

2. **Deploy to Cloud**
   - Backend: Railway, Render, Heroku
   - Frontend: Vercel, Netlify
   - Database: Supabase, Railway, Heroku

3. **Enhanced Predictions**
   - Integrate OpenWeather API
   - Use LSTM for better time-series
   - Add image-based rain detection (CNN)

4. **Mobile App**
   - React Native version
   - Push notifications
   - Offline mode

5. **Advanced Automation**
   - Real servo motor control
   - WiFi relay module integration
   - Email/SMS alerts

---

## 📞 PROJECT STRUCTURE REMINDER

```
smart-rain-ai-iot-system/
├── backend/                 → npm run dev (Terminal 1)
├── frontend/                → npm start (Terminal 2)  
├── ai/                      → Models (already trained or run: python train.py)
├── iot-simulator/           → node send_mock_data.js (Terminal 3)
├── database/                → Schema (auto-load in Docker, manual otherwise)
├── SETUP_GUIDE.md          → Detailed setup instructions
├── PROJECT_UNDERSTANDING.md → Complete architecture guide
└── This file → Quick reference
```

---

## ⏱️ EXPECTED TIMING

```
Setup: 15-20 minutes (first time)
  - Database setup: 2 min
  - AI model training: 3-5 min
  - Starting services: 5 min

Running: Anytime
  - All three services running simultaneously
  - Dashboard updates in real-time
  - Predictions generated per sensor reading
```

---

## ✨ CURRENT STATUS SUMMARY

| Component | Status | Command |
|-----------|--------|---------|
| Backend | ✅ Ready | `cd backend && npm run dev` |
| Frontend | ✅ Ready | `cd frontend && npm start` |
| AI/ML | ⏳ Pending | `cd ai && python train.py` |
| Database | ⏳ Pending | `createdb smart_rain && psql -U postgres -d smart_rain -f database/schema.sql` |
| Docker | ⏪ Skipped | Docker daemon not running |

**Next Action**: Follow Steps 1-8 above to start the complete system!

---

## 📖 HELPFUL RESOURCES

- [Complete Setup Guide](./SETUP_GUIDE.md)
- [Project Architecture Guide](./PROJECT_UNDERSTANDING.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./database/schema.sql)

---

**You're all set! Time to run the system! 🎉**
