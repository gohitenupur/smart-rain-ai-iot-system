const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = 'http://localhost:4000/api/v1';

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// API proxy endpoints
app.get('/api/v1/health', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/sensors/ingest', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/sensors/ingest`, {
      headers: req.headers
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Frontend server running on http://localhost:${PORT}`);
  console.log(`📡 Backend API at ${API_URL}`);
});
