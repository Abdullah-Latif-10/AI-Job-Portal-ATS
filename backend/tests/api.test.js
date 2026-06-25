const { test, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

const { app } = require('../server');

test('API integration tests', async (t) => {
  await t.test('GET /api/message returns hello', async () => {
    const res = await request(app).get('/api/message');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.text);
  });

  await t.test('GET /api/public/jobs returns paginated jobs', { skip: process.env.RUN_DB_TESTS !== 'true' }, async () => {
    const res = await request(app).get('/api/public/jobs');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.jobs));
    assert.ok(typeof res.body.totalCount === 'number');
  });

  await t.test('POST /api/auth/login rejects missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    assert.strictEqual(res.status, 400);
  });

  await t.test('Protected route rejects missing token', async () => {
    const res = await request(app).get('/api/candidate/profile');
    assert.strictEqual(res.status, 401);
  });
});
