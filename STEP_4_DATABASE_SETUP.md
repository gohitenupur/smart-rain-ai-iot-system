# Step-by-Step Guide: Setting Up PostgreSQL & Running the System

## 📍 CURRENT STATUS: Step 4/8

You have completed:
- ✅ Dependencies installed
- ✅ Documentation created

**Next:** Set up PostgreSQL database and initialize schema

---

## Option 1: PostgreSQL Installation (Recommended)

### ⚠️ PostgreSQL Not Found

PostgreSQL is not currently installed on your system. You have two options:

### **Option A: Quick Install (Recommended)**

#### **For Windows Users:**

1. **Download PostgreSQL 14+ from:**
   https://www.postgresql.org/download/windows/

2. **Run the installer** and:
   - Accept default installation path
   - Set password for `postgres` user (remember it!)
   - Keep port as 5432
   - Complete installation

3. **Add PostgreSQL to PATH** (if needed):
   - Open Control Panel → System → Environment Variables
   - Add: `C:\Program Files\PostgreSQL\16\bin` to PATH
   - Restart terminal

4. **Verify Installation:**
   ```bash
   psql --version
   ```
   Should show: `psql (PostgreSQL) 14.x or higher`

---

## Option 2: Use SQLite Instead (No Installation Needed)

If you don't want to install PostgreSQL, I can help you set up SQLite instead (requires minimal code changes).

---

## Once PostgreSQL is Installed/Running

### Step 1: Create Database

```bash
# Open PowerShell and run:
createdb -U postgres smart_rain
```

**If prompted for password:** Enter the password you set during PostgreSQL installation

### Step 2: Load Database Schema

```bash
# Load the SQL schema file:
psql -U postgres -d smart_rain -f "database/schema.sql"
```

You should see output like:
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
...
```

### Step 3: Verify Database Creation

```bash
# Connect to the database:
psql -U postgres -d smart_rain

# Inside psql prompt, run:
\dt
```

You should see all tables listed:
```
 Schema |       Name       | Type  | Owner
--------+------------------+-------+----------
 public | users            | table | postgres
 public | devices          | table | postgres
 public | sensor_data      | table | postgres
 public | predictions      | table | postgres
 public | alerts           | table | postgres
 public | system_settings  | table | postgres
```

Type `\q` to exit psql

---

## What's Next After Database Setup?

Once PostgreSQL is running and database is created:

1. **Train AI Models** (5 minutes)
2. **Start Backend** (localhost:4000)
3. **Start Frontend** (localhost:3000)
4. **Send Mock Data** (automated testing)
5. **View Dashboard** (real-time monitoring)

---

## Need Help?

**Don't have PostgreSQL yet?**
→ Download from: https://www.postgresql.org/download/windows/

**PostgreSQL installation stuck?**
→ Try the installer again or download newest version

**Can't find password?**
→ You can reinstall PostgreSQL and set a new password

**Want to skip PostgreSQL?**
→ Reply and I'll help you set up SQLite instead (requires code changes)

---

## Your Choice:

**👉 What would you like to do?**

- A) "I'll install PostgreSQL now" → Do that, then reply when ready
- B) "I already have PostgreSQL running" → Reply and I'll help you set up the database
- C) "I don't want to install PostgreSQL" → Reply and I'll set up SQLite for you

**Reply when you're ready to continue!**
