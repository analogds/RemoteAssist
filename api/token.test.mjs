// Minimal runnable check for api/token.js — run with: node api/token.test.mjs
import assert from 'node:assert/strict';
import handler from './token.js';

function mockRes() {
  const res = { statusCode: null, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
}

// 1. Missing room -> 400
{
  const res = mockRes();
  await handler({ query: {} }, res);
  assert.equal(res.statusCode, 400);
}

// 2. Missing env vars -> 500
{
  delete process.env.LIVEKIT_URL;
  delete process.env.LIVEKIT_API_KEY;
  delete process.env.LIVEKIT_API_SECRET;
  const res = mockRes();
  await handler({ query: { room: 'test-room' } }, res);
  assert.equal(res.statusCode, 500);
}

// 3. Valid input -> 200 with a signed JWT
{
  process.env.LIVEKIT_URL = 'wss://example.livekit.cloud';
  process.env.LIVEKIT_API_KEY = 'APItest';
  process.env.LIVEKIT_API_SECRET = 'testsecrettestsecrettestsecret12';
  const res = mockRes();
  await handler({ method: 'GET', query: { room: 'test-room', identity: 'admin' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.url, 'wss://example.livekit.cloud');
  assert.equal(res.body.token.split('.').length, 3);
  const claims = JSON.parse(Buffer.from(res.body.token.split('.')[1], 'base64url').toString());
  // 4. Caller cannot choose the identity
  assert.notEqual(claims.sub, 'admin');
  assert.match(claims.sub, /^user-[0-9a-f]{8}$/);
  // 5. Token is short-lived
  assert.equal(claims.exp - claims.nbf, 600);
}

// 6. Non-GET -> 405
{
  const res = mockRes();
  await handler({ method: 'POST', query: { room: 'test-room' } }, res);
  assert.equal(res.statusCode, 405);
}

// 7. Invalid room names -> 400
for (const room of ['r'.repeat(65), 'bad\nroom', ['a', 'b']]) {
  const res = mockRes();
  await handler({ method: 'GET', query: { room } }, res);
  assert.equal(res.statusCode, 400);
}

console.log('api/token.js: all checks passed');
