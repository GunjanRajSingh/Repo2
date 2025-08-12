const request = require('supertest');
const app = require('../app');

test('GET /ping returns 200 and pong', async () => {
  const res = await request(app).get('/ping');
  expect(res.statusCode).toBe(200);
  expect(res.body.pong).toBe(true);
});
