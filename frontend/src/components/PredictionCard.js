import React from 'react';

export default function PredictionCard({ row }) {
  if (!row || row.rain_probability == null) {
    return (
      <div style={styles.card}>
        <p style={styles.empty}>No prediction yet. Send sensor data to see AI output.</p>
      </div>
    );
  }

  const prob = Math.round(row.rain_probability * 100);
  const isRain = row.predicted_rain;
  const color = isRain ? '#ef5350' : '#26c6da';

  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div style={styles.header}>
        <span style={{ fontSize: 36 }}>{isRain ? '🌧️' : '☀️'}</span>
        <div>
          <div style={{ ...styles.label, color }}>{isRain ? 'RAIN DETECTED' : 'NO RAIN'}</div>
          <div style={styles.prob}>{prob}% probability</div>
        </div>
      </div>
      <div style={styles.bar}>
        <div style={{ ...styles.fill, width: `${prob}%`, background: color }} />
      </div>
      <div style={styles.forecasts}>
        <div style={styles.forecast}><span style={styles.fLabel}>1h</span><span style={styles.fVal}>{Number(row.forecast_1h_mm).toFixed(2)} mm</span></div>
        <div style={styles.forecast}><span style={styles.fLabel}>2h</span><span style={styles.fVal}>{Number(row.forecast_2h_mm).toFixed(2)} mm</span></div>
        <div style={styles.forecast}><span style={styles.fLabel}>3h</span><span style={styles.fVal}>{Number(row.forecast_3h_mm).toFixed(2)} mm</span></div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: '20px 24px',
  },
  empty: { color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', margin: 0 },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 },
  label: { fontWeight: 700, fontSize: 15, letterSpacing: 1 },
  prob: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },
  bar: { background: 'rgba(255,255,255,0.1)', borderRadius: 6, height: 8, marginBottom: 16, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6, transition: 'width 0.5s' },
  forecasts: { display: 'flex', gap: 12 },
  forecast: {
    flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 10,
    padding: '10px 8px', textAlign: 'center',
  },
  fLabel: { display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600, marginBottom: 4 },
  fVal: { color: '#fff', fontWeight: 700, fontSize: 14 },
};
