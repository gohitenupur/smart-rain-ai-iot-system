# 🔗 HARDWARE TO WEB PROJECT INTEGRATION GUIDE

## Step-by-Step Guide: Connect ESP32 Hardware to Web Backend

---

## 📋 INTEGRATION OVERVIEW

```
┌──────────────────┐
│  ESP32 Hardware  │
│  (Microcontroller│
│  + Sensors)      │
└────────┬─────────┘
         │ WiFi + HTTP
         ▼
┌──────────────────────────────┐
│   Node.js Backend API        │
│   Port 4000                  │
│   (Express Server)           │
└────────┬─────────────────────┘
         │ REST API
         ▼
┌──────────────────────────────┐
│   PostgreSQL Database        │
│   Port 5432                  │
└────────┬─────────────────────┘
         │ Database
         ▼
┌──────────────────────────────┐
│   React Frontend Dashboard   │
│   Port 3000                  │
│   (Real-time visualization)  │
└──────────────────────────────┘
```

---

## 🚀 STEP 1: PREPARE BACKEND API

### **Verify API Endpoints Exist**

The backend already has endpoints ready. Verify they're enabled:

Check file: [backend/src/routes/index.js](backend/src/routes/index.js)

**Required endpoints:**
```
POST /api/v1/sensors/data      → Receive sensor readings
GET  /api/v1/sensors/data      → Get historical data
POST /api/v1/devices/heartbeat → Device health check
```

### **Verify Database Schema**

Check file: [database/schema.sql](database/schema.sql)

**Must have tables:**
```sql
CREATE TABLE sensor_data (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(100),
  temperature FLOAT,
  humidity FLOAT,
  pressure FLOAT,
  rain_level INT,
  rain_detected BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(100) UNIQUE,
  device_name VARCHAR(100),
  location VARCHAR(255),
  status VARCHAR(50),
  last_heartbeat TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 STEP 2: CONFIGURE ESP32 SKETCH

### **Update WiFi Credentials**

Edit `ESP32_SENSOR_CODE.ino` and update:

```cpp
// Line 47-48
const char* SSID = "YOUR_COLLEGE_WIFI";         // Your WiFi name
const char* PASSWORD = "YOUR_WIFI_PASSWORD";    // Your WiFi password
```

### **Update Backend URL**

```cpp
// Line 51 - Update IP address based on your setup
const char* BACKEND_URL = "http://192.168.1.100:4000/api/v1";

// Common IP addresses:
// - Laptop running backend: 192.168.1.X (check ipconfig)
// - Raspberry Pi: 192.168.1.X
// - AWS Server: your.public.ip.address
```

### **Set Device ID**

```cpp
// Line 52 - Unique identifier for this hardware
const char* DEVICE_ID = "esp32-rain-sensor-01";
```

### **Configure Sensor Intervals**

```cpp
// Line 56-58
const unsigned long SENSOR_READ_INTERVAL = 5000;  // Read every 5 seconds
const unsigned long DATA_SEND_INTERVAL = 30000;   // Send every 30 seconds
const unsigned long HEARTBEAT_INTERVAL = 60000;   // Heartbeat every 60 seconds
```

---

## 📤 STEP 3: UPLOAD TO ESP32

### **Upload Process**

1. **Connect ESP32** via USB to computer
2. **Open Arduino IDE**
3. **File → Open** → Select `ESP32_SENSOR_CODE.ino`
4. **Tools → Board** → Select "ESP32 Dev Kit"
5. **Tools → Port** → Select your COM port
6. **Sketch → Upload** (or press Ctrl+U)
7. **Wait** for upload to complete

### **Expected Upload Output**

```
Sketch uses 523456 bytes (39%) of program storage space.
Maximum is 1310720 bytes.
Variables use 45782 bytes (13%) of dynamic memory.
Maximum is 294912 bytes.

Uploading 527344 bytes to flash at 0x00001000

....................................✓

Hard resetting via RTS pin...
```

### **Verify Upload Success**

1. Open **Serial Monitor** (Tools → Serial Monitor)
2. Set **Baud Rate** to **115200**
3. You should see:

```
===========================================
  SMART RAIN DETECTION SYSTEM - ESP32
  Starting initialization...
===========================================

[INIT] Initializing DHT22 sensor...
[INIT] Initializing BMP280 sensor...
[INIT] Connecting to WiFi...
[WIFI] Connecting to YOUR_COLLEGE_WIFI
....
[WIFI] Connected! IP: 192.168.1.105

[SUCCESS] System initialization complete!

[INFO] Reading sensors...
[SENSOR] Temperature: 28.5°C, Humidity: 65%
[SENSOR] Pressure: 1013.25 hPa
[SENSOR] Rain Level: 45%, Detected: NO
[API] Sending data: {"deviceId":"esp32-rain-sensor-01",...}
[SUCCESS] Data sent successfully! Response code: 200
```

---

## 🖥️ STEP 4: START BACKEND SERVER

### **Option A: Using Docker (Recommended)**

```bash
# From project root directory
docker-compose up --build

# Services will start:
# - Backend: http://localhost:4000
# - Frontend: http://localhost:3000
# - PostgreSQL: localhost:5432
```

### **Option B: Manual Setup**

```bash
# Terminal 1: Start PostgreSQL
# (Already running or start your PostgreSQL service)

# Terminal 2: Start Backend
cd backend
npm install
npm start

# Expected output:
# Server running on port 4000
# Database connected
# Ready to receive data from ESP32

# Terminal 3: Start Frontend
cd frontend
npm install
npm start

# Opens http://localhost:3000 in browser
```

### **Verify Backend is Running**

Test the API endpoint:

```bash
# Using curl
curl http://localhost:4000/api/v1/health

# Using Postman
GET http://localhost:4000/api/v1/health

# Expected response:
{"status": "ok", "message": "API is running"}
```

---

## 📊 STEP 5: TEST DATA FLOW

### **Manual Test with Sample Data**

Send test data from your computer to verify the pipeline:

```bash
curl -X POST http://localhost:4000/api/v1/sensors/data \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "esp32-rain-sensor-01",
    "temperature": 28.5,
    "humidity": 65,
    "pressure": 1013.25,
    "rainLevel": 45,
    "rainDetected": false,
    "timestamp": 1234567890
  }'

# Expected response:
{"success": true, "message": "Sensor data received"}
```

### **Check Database**

Verify data is saved in PostgreSQL:

```bash
# Connect to PostgreSQL
psql -U postgres -d smart_rain

# Check sensor data
SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 10;

# You should see your test data
```

### **Check Frontend**

1. Open browser: http://localhost:3000
2. Navigate to Dashboard
3. Look for:
   - ✅ Real-time sensor readings chart
   - ✅ Current temperature/humidity display
   - ✅ Rain detection indicator
   - ✅ Device status (online/offline)

---

## 🔄 STEP 6: LIVE DATA FLOW

Once everything is connected, data flows like this:

```
1. ESP32 reads sensors (every 5 seconds)
   ↓
2. ESP32 sends JSON to API (every 30 seconds)
   ↓
3. Backend receives POST request at /api/v1/sensors/data
   ↓
4. Backend validates & processes data
   ↓
5. Backend saves to PostgreSQL database
   ↓
6. Frontend polls API for latest data (auto-refresh)
   ↓
7. Dashboard updates real-time charts
   ↓
8. Alerts triggered if rain detected
```

---

## 🛠️ TROUBLESHOOTING

### **Issue: ESP32 Can't Connect to WiFi**

**Symptoms:** Serial shows "WiFi connection failed"

**Solutions:**
```
1. Verify WiFi SSID and password are correct
2. Check WiFi is 2.4GHz (not 5GHz)
3. Move ESP32 closer to router
4. Restart WiFi router
5. Reset ESP32: Hold RESET button for 2 seconds
```

### **Issue: Backend Connection Fails**

**Symptoms:** Serial shows "HTTP POST failed! Code: 500"

**Solutions:**
```
1. Check backend URL is correct
   - Get IP: ipconfig (on Windows) or ifconfig (Linux)
   - Verify port 4000 is accessible
   
2. Ensure backend is running
   - Open http://localhost:4000/api/v1/health in browser
   
3. Check firewall
   - Allow port 4000 through Windows Firewall
   - Disable firewall temporarily for testing
   
4. Verify JSON format
   - Check ArduinoJson library is installed
   - Verify sensor values are valid numbers
```

### **Issue: Data Not Appearing in Dashboard**

**Symptoms:** Backend receives data, but dashboard is empty

**Solutions:**
```
1. Refresh browser (Ctrl+F5)
2. Check browser console for errors (F12)
3. Verify database connection
   - Check PostgreSQL is running
   - Verify schema.sql was executed
4. Restart frontend: npm start
```

### **Issue: Sensors Showing Wrong Values**

**Symptoms:** Temperature shows 0°C, humidity shows -1%

**Solutions:**
```
1. Check sensor wiring (see HARDWARE_SETUP_GUIDE.md)
2. Verify I2C pins for BMP280 (SCL=22, SDA=21)
3. Check DHT22 data pin (should be GPIO 4)
4. Reload ESP32 code
5. Check serial monitor for error messages
```

---

## 📱 TESTING CHECKLIST

- [ ] ESP32 uploads successfully
- [ ] Serial Monitor shows sensor readings
- [ ] ESP32 connects to WiFi
- [ ] Backend API is running
- [ ] Database has sensor_data table
- [ ] Test data can be sent via curl
- [ ] Test data appears in database
- [ ] Frontend dashboard loads
- [ ] Real-time data appears on dashboard
- [ ] Multiple ESP32 devices can connect (if testing multiples)
- [ ] Alerts trigger on rain detection
- [ ] System works offline (falls back gracefully)

---

## 🎯 COMPLETION CHECKLIST

**Hardware Setup:**
- [ ] All sensors connected to ESP32
- [ ] WiFi connected
- [ ] Arduino code uploaded

**Backend:**
- [ ] Server running on port 4000
- [ ] Database connected and populated
- [ ] API endpoints responding

**Frontend:**
- [ ] Dashboard loaded on port 3000
- [ ] Displaying real-time data
- [ ] Charts updating automatically

**Integration:**
- [ ] ESP32 sends data to backend
- [ ] Data visible in dashboard
- [ ] All 3 tiers connected and communicating

---

## 📞 QUICK REFERENCE

### **Key Endpoints**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/v1/sensors/data | Send sensor reading |
| GET | /api/v1/sensors/data | Get all readings |
| POST | /api/v1/devices/heartbeat | Send device status |
| GET | /api/v1/devices | List all devices |

### **Ports to Remember**

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 4000 | http://localhost:4000 |
| PostgreSQL | 5432 | localhost:5432 |

### **Default Credentials**

| Service | User | Password | Note |
|---------|------|----------|------|
| PostgreSQL | postgres | postgres | Change in production |
| WiFi | [Your SSID] | [Your Password] | Update in code |

---

## 🎓 FOR COLLEGE PROJECT SUBMISSION

**What to prepare:**

1. **Hardware Setup Report**
   - Photos of complete setup
   - Circuit diagram
   - BOM (Bill of Materials) with costs

2. **Software Documentation**
   - Code comments explaining logic
   - Configuration guide
   - API documentation

3. **Integration Guide** (THIS FILE)
   - Step-by-step setup
   - Troubleshooting section
   - Testing checklist

4. **Live Demo Requirements**
   - Working hardware connected
   - Data flowing to backend
   - Dashboard showing real-time updates
   - Alerts triggering on rain

5. **Performance Report**
   - Sensor accuracy comparison
   - API response times
   - Database query performance
   - Memory usage on ESP32

---

**Next Steps:** Proceed to STEP 3 above and upload the ESP32 code!
