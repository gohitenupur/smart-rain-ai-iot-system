import React, { useState } from 'react';
import { login, register } from '../services/api';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, role);
        setIsRegister(false);
        setError('');
        alert('Registered successfully! Please log in.');
      } else {
        const data = await login(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        onLogin(data.token);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.logo}>🌧️</div>
        <h1 style={styles.title}>Smart Rain System</h1>
        <h2 style={styles.subtitle}>{isRegister ? 'Create Account' : 'Sign In'}</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {isRegister && (
            <select style={styles.input} value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Please wait…' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p style={styles.toggle}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span style={styles.link} onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Sign In' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: '48px 40px',
    width: 380,
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  logo: { fontSize: 56, marginBottom: 8 },
  title: { color: '#fff', margin: '0 0 4px', fontSize: 22, fontWeight: 700 },
  subtitle: { color: '#90caf9', margin: '0 0 24px', fontSize: 15, fontWeight: 400 },
  error: { color: '#ff6b6b', background: 'rgba(255,107,107,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 12 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: {
    padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, outline: 'none',
  },
  btn: {
    padding: '13px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
    color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    marginTop: 4, transition: 'opacity 0.2s',
  },
  toggle: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 20 },
  link: { color: '#42a5f5', cursor: 'pointer', fontWeight: 600 },
};
