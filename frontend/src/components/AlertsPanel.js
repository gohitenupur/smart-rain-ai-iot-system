import React from 'react';

const SEVERITY_COLOR = { high: '#ef5350', medium: '#ffa726', info: '#26c6da' };

export default function AlertsPanel({ alerts }) {
  if (!alerts.length) {
    return (
      <div style={styles.empty}>
        ✅ No alerts yet — system is quiet.
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {alerts.map(a => (
        <div key={a.id} style={{ ...styles.item, borderLeft: `4px solid ${SEVERITY_COLOR[a.severity] || '#aaa'}` }}>
          <div style={styles.top}>
            <span style={{ ...styles.badge, background: SEVERITY_COLOR[a.severity] || '#aaa' }}>
              {a.severity.toUpperCase()}
            </span>
            <span style={styles.time}>{new Date(a.created_at).toLocaleString()}</span>
          </div>
          <p style={styles.msg}>{a.message}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  empty: {
    color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center',
    padding: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 12,
  },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  item: {
    background: 'rgba(255,255,255,0.05)', borderRadius: '0 12px 12px 0',
    padding: '12px 16px',
  },
  top: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 },
  badge: { fontSize: 10, fontWeight: 700, color: '#fff', borderRadius: 4, padding: '2px 6px' },
  time: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
  msg: { color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0 },
};
