# 🔧 Fix and Run Smart Rain Project

## ⚠️ Current Issue
- Frontend npm install has dependency conflicts
- The `which` module is missing
- Node modules may be corrupted

## ✅ Solution: Quick Fix

### Step 1: Clean Everything
```powershell
# Navigate to project root
cd "c:\Users\HPP\OneDrive - United Gaming LLC\Desktop\Nupur\projects\smart-rain-ai-iot-system"

# Kill any existing processes
taskkill /F /IM node.exe 2>$null

# Clear npm cache
npm cache clean --force
```

### Step 2: Clean Frontend
```powershell
cd frontend

# Remove all node_modules
Remove-Item node_modules -Recurse -Force -ErrorAction Ignore

# Remove lock file
Remove-Item package-lock.json -Force -ErrorAction Ignore

# Go back to root
cd ..
```

### Step 3: Reinstall with Legacy Peer Deps
```powershell
cd frontend
npm install --legacy-peer-deps
```

### Step 4: Start Backend (Terminal 1)
```powershell
cd backend
npm install
npm start
```
Expected output: `Smart Rain API running on port 4000`

### Step 5: Start Frontend (Terminal 2)
```powershell
cd frontend
npm start
```
Expected output: `webpack compiled successfully`

### Step 6: Access the Project
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **API**: http://localhost:4000/api/v1

---

## 🆘 If Still Having Issues

### Option A: Use Python Simple Server (No React)
```powershell
# Start backend only
cd backend
npm install
npm start

# Test with cURL
curl http://localhost:4000/api/v1/health
```

### Option B: Check Node Version
```powershell
node --version   # Should be v14 or higher
npm --version    # Should be v6 or higher
```

If versions are old, update Node.js from https://nodejs.org/

### Option C: Nuke and Reinstall
```powershell
$projectRoot = "c:\Users\HPP\OneDrive - United Gaming LLC\Desktop\Nupur\projects\smart-rain-ai-iot-system"

# Kill all node processes
taskkill /F /IM node.exe

# Remove all node_modules and lock files
cd $projectRoot
Get-ChildItem -Path . -Include "node_modules", "package-lock.json" -Recurse | Remove-Item -Recurse -Force

# Clear cache
npm cache clean --force

# Reinstall everything
cd backend ; npm install
cd ../frontend ; npm install --legacy-peer-deps
```

---

## ✅ Backend Only (Minimum Working Setup)

If frontend keeps failing, use **backend only**:

```powershell
cd backend
npm install
npm start
```

Then test with API calls:

```bash
# Health check
curl http://localhost:4000/api/v1/health

# Register user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com"
  }'

# Send sensor data
curl -X POST http://localhost:4000/api/v1/sensors/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "esp32-01",
    "deviceName": "Test Device",
    "location": "Test Location",
    "temperatureC": 28.5,
    "humidityPct": 65,
    "pressureHpa": 1013.25,
    "rainAnalog": 45,
    "rainDetected": false
  }'
```

---

## 📊 Project Status After Fix

| Component | Status | Command |
|-----------|--------|---------|
| Backend | Ready | `cd backend && npm start` |
| Frontend | (Optional) | `cd frontend && npm start` |
| Database | Configured | PostgreSQL at localhost:5432 |
| API | Ready | Port 4000 |

---

## 🎯 Quick Commands

```powershell
# Kill all node processes
taskkill /F /IM node.exe

# Check if port is in use
netstat -ano | findstr :4000

# Navigate to project
cd "c:\Users\HPP\OneDrive - United Gaming LLC\Desktop\Nupur\projects\smart-rain-ai-iot-system"

# Start fresh
npm cache clean --force
cd backend && npm install && npm start
```

---

**Follow these steps in order and the project will be running!** 🚀
