import React, { useEffect, useMemo, useState } from 'react';
import { fetchLiveData } from './services/api';
import SensorChart from './components/SensorChart';

const fakeToken = 'replace-with-jwt-token-after-login';

function App() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer;

    async function load() {
      try {
        const data = await fetchLiveData(fakeToken);
        setRows(data);
        setError('');
      } catch (err) {
        setError('Unable to load data. Ensure backend is running and token is valid.');
      }
    }

    load();
    timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, []);

  const latest = useMemo(() => (rows.length ? rows[0] : null), [rows]);

  return (
    <main style={{ fontFamily: 'Arial', padding: 24 }}>
      <h1>Smart Rain Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        <h2>Latest Reading</h2>
        {latest ? (
          <ul>
            <li>Temperature: {latest.temperature_c} °C</li>
            <li>Humidity: {latest.humidity_pct} %</li>
            <li>Pressure: {latest.pressure_hpa} hPa</li>
            <li>Rain analog: {latest.rain_analog}</li>
            <li>Captured at: {new Date(latest.captured_at).toLocaleString()}</li>
          </ul>
        ) : (
          <p>No readings yet.</p>
        )}
      </section>

      <section>
        <h2>Sensor Trends</h2>
        <SensorChart data={[...rows].reverse()} />
      </section>
    </main>
  );
}

export default App;
