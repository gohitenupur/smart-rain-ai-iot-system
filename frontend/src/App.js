import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { fetchLiveData, fetchAlerts } from './services/api';
import SensorChart from './components/SensorChart';
import PredictionCard from './components/PredictionCard';
import AlertsPanel from './components/AlertsPanel';
import Login from './components/Login';

/* ─────────────── global styles ─────────────── */
const G = {
  body: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)',
    color: '#fff',
    margin: 0,
  },
  header: {
    background: 'rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: 0.5 },
  sub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  logoutBtn: {
    background: 'rgba(239,83,80,0.15)', border: '1px solid rgba(239,83,80,0.3)',
    color: '#ef5350', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13,
  },
  main: { maxWidth: 1100, margin: '0 auto', padding: '28px 24px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 16, padding: '20px 24px',
  },
  sectionTitle: { margin: '0 0 14px', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1.2 },
  statLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 12, marginBottom: 4 },
  statValue: { color: '#fff', fontSize: 26, fontWeight: 700 },
  statUnit: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginLeft: 4 },
  error: { color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', borderRadius: 8, padding: '10px 16px', fontSize: 13, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#26c6da', display: 'inline-block', marginRight: 6, animation: 'pulse 1.5s infinite' },
  badge: { fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(38,198,218,0.15)', color: '#26c6da', fontWeight: 600 },
};

function StatCard({ label, value, unit, accent = '#26c6da' }) {
  return (
    <div style={{ ...G.card, borderTop: `3px solid ${accent}` }}>
      <p style={G.statLabel}>{label}</p>
      <div>
        <span style={{ ...G.statValue, color: accent }}>{value ?? '—'}</span>
        {unit && <span style={G.statUnit}>{unit}</span>}
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [rows, setRows] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [data, alertsData] = await Promise.all([
        fetchLiveData(token),
        fetchAlerts(token),
      ]);
      setRows(data);
      setAlerts(alertsData);
      setError('');
      setLastRefresh(new Date());
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setToken('');
      } else {
        setError('Unable to load data. Ensure backend is running.');
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [load, token]);

  function handleLogin(t) { setToken(t); }
  function handleLogout() { localStorage.removeItem('token'); setToken(''); setRows([]); setAlerts([]); }

  if (!token) return <Login onLogin={handleLogin} />;

  const latest = useMemo(() => (rows.length ? rows[0] : null), [rows]);
  const role = localStorage.getItem('role') || '';

  return (
    <div style={G.body}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>

      {/* Header */}
      <header style={G.header}>
        <div>
          <h1 style={G.title}>🌧️ Smart Rain Dashboard</h1>
          <p style={G.sub}>Real-time IoT sensor monitoring with AI predictions</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {lastRefresh && (
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
              <span style={G.dot} />
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          {role && <span style={G.badge}>{role.toUpperCase()}</span>}
          <button style={G.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main style={G.main}>
        {error && <div style={G.error}>⚠️ {error}</div>}

        {/* Stat cards */}
        <div style={G.grid3}>
          <StatCard label="Temperature" value={latest?.temperature_c} unit="°C" accent="#ff7043" />
          <StatCard label="Humidity" value={latest?.humidity_pct} unit="%" accent="#26c6da" />
          <StatCard label="Pressure" value={latest?.pressure_hpa} unit="hPa" accent="#ab47bc" />
        </div>

        <div style={G.grid3}>
          <StatCard label="Rain Analog" value={latest?.rain_analog} accent="#42a5f5" />
          <StatCard label="Readings Loaded" value={rows.length} accent="#66bb6a" />
          <StatCard label="Active Alerts" value={alerts.length} accent={alerts.length ? '#ef5350' : '#66bb6a'} />
        </div>

        {/* Prediction + Alerts */}
        <div style={G.grid2}>
          <div>
            <p style={G.sectionTitle}>AI Prediction</p>
            <PredictionCard row={latest} />
          </div>
          <div>
            <p style={G.sectionTitle}>Recent Alerts</p>
            <AlertsPanel alerts={alerts.slice(0, 5)} />
          </div>
        </div>

        {/* Chart */}
        <div style={G.card}>
          <p style={G.sectionTitle}>Sensor Trends (last 30 readings)</p>
          {rows.length ? (
            <SensorChart data={[...rows].reverse()} />
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 32 }}>
              No data yet. Start the IoT simulator or connect hardware.
            </p>
          )}
        </div>

        {/* Latest raw reading */}
        {latest && (
          <div style={{ ...G.card, marginTop: 20 }}>
            <p style={G.sectionTitle}>Latest Reading Detail</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 13 }}>
              {[
                ['Device', latest.device_id],
                ['Captured', new Date(latest.captured_at).toLocaleString()],
                ['Temperature', `${latest.temperature_c} °C`],
                ['Humidity', `${latest.humidity_pct} %`],
                ['Pressure', `${latest.pressure_hpa} hPa`],
                ['Rain Analog', latest.rain_analog],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
