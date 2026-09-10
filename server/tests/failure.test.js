import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Talk } from '../src/models/Talk.js';
import { ROLES } from '@vignak/shared';

let mongo;
let app;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_value_1234567890ab';
  process.env.CLIENT_URL = 'http://localhost:5173';
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  await mongoose.connect(process.env.MONGODB_URI);
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

describe('Phase 3 graceful failure', () => {
  it('returns 503 from /api/ready when DB is disconnected', async () => {
    await mongoose.disconnect();
    const res = await request(app).get('/api/ready');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('not_ready');
    await mongoose.connect(process.env.MONGODB_URI);
  });

  it('rejects expired/invalid auth cookie with 401', async () => {
    const res = await request(app)
      .get('/api/admin/me')
      .set('Cookie', ['vignak_token=not.a.valid.jwt']);
    expect(res.status).toBe(401);
  });

  it('returns 404 for missing admin resource', async () => {
    const passwordHash = await User.hashPassword('StrongPassword123!');
    await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      passwordHash,
      role: ROLES.ADMIN,
    });
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({
      email: 'admin@test.com',
      password: 'StrongPassword123!',
    });
    const res = await agent.get('/api/admin/leads/000000000000000000000001');
    expect(res.status).toBe(404);
  });

  it('rejects duplicate talk registration with 409', async () => {
    const talk = await Talk.create({
      title: 'Dup Talk',
      slug: 'dup-talk',
      description: 'Talk used to verify duplicate registration is rejected cleanly.',
      status: 'REGISTRATION_OPEN',
      registrationOpen: true,
      published: true,
    });
    const payload = { name: 'Guest', email: 'guest@example.com' };
    expect((await request(app).post(`/api/talks/${talk._id}/register`).send(payload)).status).toBe(201);
    expect((await request(app).post(`/api/talks/${talk._id}/register`).send(payload)).status).toBe(409);
  });
});
