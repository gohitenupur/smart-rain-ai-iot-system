import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api/v1'
});

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data; // { token, role }
}

export async function register(email, password, role = 'user') {
  const res = await api.post('/auth/register', { email, password, role });
  return res.data;
}

export async function fetchLiveData(token) {
  const res = await api.get('/sensors/live', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function fetchAlerts(token) {
  const res = await api.get('/alerts', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export default api;

