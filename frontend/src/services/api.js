import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api/v1'
});

export async function fetchLiveData(token) {
  const res = await api.get('/sensors/live', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export default api;
