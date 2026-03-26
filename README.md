# Smart Rain Detection and Prediction System using AI & IoT

Production-ready starter project integrating IoT simulation, Node.js API, Python ML models, PostgreSQL schema, and React dashboard.

## 1) Folder Structure

```text
smart-rain-ai-iot-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── tests/
├── ai/
│   ├── data/
│   ├── models/
│   ├── tests/
│   ├── train.py
│   └── inference.py
├── frontend/
│   └── src/
├── database/
│   └── schema.sql
├── docs/
│   └── API.md
├── iot-simulator/
│   └── send_mock_data.js
└── mock-data/
    └── sensor_payload.json
```

## 2) Setup

### Database
1. Create PostgreSQL database named `smart_rain`.
2. Run:
   ```bash
   psql -U postgres -d smart_rain -f database/schema.sql
   ```

### AI Model Training
```bash
cd ai
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python train.py
```

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 3) Backend Environment Variables

Create `backend/.env`:

```env
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

## 4) Feature Coverage
- Real-time sensor ingestion API with validation.
- AI rain detection (classification) + rainfall forecast (1h/2h/3h).
- Dynamic threshold from DB (`system_settings`) — no hardcoded threshold.
- Role-based access (`admin`, `user`) via JWT.
- Automation simulation logs when rain risk is high.
- React dashboard with real-time polling and graphs.
- IoT mock data simulator script.
- Unit tests for API and AI inference.

## 5) Development Strategy (Simple First)
1. Run DB + backend + `/sensors/ingest`.
2. Train and connect AI model.
3. Start dashboard.
4. Add simulator + automation.
5. Expand to hardware (ESP32) and notifications (Firebase/Blynk).

## 6) Deployment Path
- Backend: Render / Railway
- Frontend: Vercel
- DB: Supabase / Neon

See full endpoint details in `docs/API.md`.
