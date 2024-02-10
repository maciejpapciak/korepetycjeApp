const request = require('supertest');

const app = require('../app');

describe('Root path test (`/`)', () => {
  test('It should respond with GET method', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
