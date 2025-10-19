const request = require('supertest');

// We'll import the app directly. The Post model will be mocked to avoid DB dependency.
jest.mock('../models/Post', () => {
  // Create a chainable thenable object that supports sort/skip/limit/populate and resolves to []
  const terminal = {
    sort() { return terminal; },
    skip() { return terminal; },
    limit() { return terminal; },
    populate() { return terminal; },
    then(resolve) { return resolve([]); },
    catch() { return terminal; }
  };

  return {
    find: jest.fn(() => terminal),
    countDocuments: jest.fn().mockResolvedValue(0)
  };
});

const app = require('../app');

describe('GET /api/posts', () => {
  it('returns 200 and a list (possibly empty)', async () => {
    const res = await request(app).get('/api/posts').expect(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
