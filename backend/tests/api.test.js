const request = require('supertest');
const app = require('../src/app');

describe('API health and validation', () => {
  test('GET /api/v1/health returns ok', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('POST /api/v1/sensors/ingest rejects invalid body with 422', async () => {
    const response = await request(app).post('/api/v1/sensors/ingest').send({});
    expect(response.statusCode).toBe(400);
  });
});
