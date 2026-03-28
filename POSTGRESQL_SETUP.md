# PostgreSQL Setup Guide - Smart Rain Detection System

## 🚀 QUICK START: Set Up PostgreSQL in 5 Minutes

### Step 1: Download PostgreSQL Installer

**Download Link:** https://www.postgresql.org/download/windows/

**Recommended Version:** PostgreSQL 16 (latest stable)

---

## 📥 Installation Steps (Windows)

### 1. Run the Installer

1. Download the installer (EXE file)
2. Double-click to run it
3. Click "Next" through the setup wizard

### 2. Important Settings During Installation

When prompted, set these values:

```
Installation Directory:  C:\Program Files\PostgreSQL\16  [Accept default]
Port:                   5432  [Keep default]
Superuser Password:     postgres  [IMPORTANT: Remember this!]
Locale:                 Default  [Accept default]
```

**⚠️ Remember the password you set!** You'll need it to connect.

### 3. Complete Installation

- Click "Install"
- Let it finish (2-3 minutes)
- Uncheck "Stack Builder" at the end
- Click "Finish"

### 4. Add PostgreSQL to System PATH (if needed)

If `psql` command doesn't work later:

1. Open Windows Search → "Environment Variables"
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "System variables", find "Path" and click "Edit"
5. Click "New" and add: `C:\Program Files\PostgreSQL\16\bin`
6. Click OK on all dialogs
7. **Restart your terminal/PowerShell**

### 5. Verify Installation

Open a new PowerShell window and run:

```bash
psql --version
```

**Expected output:**
```
psql (PostgreSQL) 16.x (Windows x86_64)
```

If you see this, PostgreSQL is installed! ✅

---

## 🗄️ Create the Database

Once PostgreSQL is installed and running, run these commands:

### Command 1: Create Database

```bash
cd c:\Users\HPP\OneDrive - United Gaming LLC\Desktop\Nupur\projects\smart-rain-ai-iot-system
createdb -U postgres smart_rain
```

**If prompted:** Enter password = `postgres`

### Command 2: Load Database Schema

```bash
psql -U postgres -d smart_rain -f database/schema.sql
```

You should see output like:
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
```

### Command 3: Verify Database

```bash
psql -U postgres -d smart_rain -c "\dt"
```

**Expected output:**
```
 Schema |       Name       | Type  | Owner
--------+------------------+-------+----------
 public | users            | table | postgres
 public | devices          | table | postgres
 public | sensor_data      | table | postgres
 public | predictions      | table | postgres
 public | alerts           | table | postgres
 public | system_settings  | table | postgres
(6 rows)
```

---

## ✅ DATABASE SETUP COMPLETE!

If you see all 6 tables listed, your database is ready! 🎉

---

## 🔧 Create Backend Environment File

Now create the `.env` file for the backend:

```bash
cd backend
copy .env.example .env
```

Check that `.env` contains (should be the same as `.env.example`):

```
PORT=4000
NODE_ENV=development
JWT_SECRET=super-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=smart_rain
PYTHON_EXECUTABLE=python3
```

---

## 🎯 Next Steps

Once database is set up:

```
✅ Step 4: Database setup complete
⏳ Step 5: Train AI models (python train.py)
⏳ Step 6: Start backend (npm run dev)
⏳ Step 7: Start frontend (npm start)
⏳ Step 8: Send mock data & test
```

---

## 🆘 Troubleshooting

### Error: "createdb: command not found"
→ PostgreSQL not in PATH. Add it manually (see Step 5 above) and restart terminal

### Error: "FATAL: password authentication failed"
→ Wrong password. Default is `postgres` if you didn't change it during install

### Error: "database smart_rain already exists"
→ Database already created. That's OK! Skip to schema loading.

### Error: "psql: invalid value for --command"
→ Try without `-c`: `psql -U postgres -d smart_rain` then type `\dt` inside

### Can't connect to database
→ PostgreSQL might not be running. Restart your computer or manually start it from Windows Services

---

## 🚀 Ready to Continue?

Once database is set up, reply with:

**"Database ready"** → I'll help you train the AI models

---

**Your next command to test:**
```bash
psql -U postgres -d smart_rain -c "\dt"
```

**Should show 6 tables if successful!**
