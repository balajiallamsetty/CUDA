import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { ROLES } from '@vignak/shared';

let mongo;
let app;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_value_123456';
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

describe('GET /api/health', () => {
  it('returns ok when database is connected', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.database).toBe('connected');
    expect(res.body).not.toHaveProperty('mongodbUri');
    expect(JSON.stringify(res.body)).not.toMatch(/secret/i);
  });
});

describe('POST /api/leads', () => {
  it('rejects invalid payloads', async () => {
    const res = await request(app).post('/api/leads').send({ name: 'A' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('creates a lead with valid data', async () => {
    const res = await request(app).post('/api/leads').send({
      name: 'Balaji',
      email: 'balaji@example.com',
      service: 'Website',
      description: 'Need a college website redesign with admissions enquiry flow.',
      organizationType: 'College',
      preferredContactMethod: 'Email',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
  });
});

describe('POST /api/contact', () => {
  it('rejects invalid payloads', async () => {
    const res = await request(app).post('/api/contact').send({ email: 'bad' });
    expect(res.status).toBe(400);
  });

  it('creates an inquiry with valid data', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Priya',
      email: 'priya@example.com',
      subject: 'Partnership',
      message: 'Interested in collaborating on a campus event series.',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});

describe('Authentication and admin protection', () => {
  async function createAdmin() {
    const passwordHash = await User.hashPassword('StrongPassword123!');
    return User.create({
      name: 'Admin',
      email: 'admin@vignak.test',
      passwordHash,
      role: ROLES.ADMIN,
    });
  }

  it('rejects invalid credentials', async () => {
    await createAdmin();
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@vignak.test',
      password: 'wrong-password',
    });
    expect(res.status).toBe(401);
  });

  it('logs in with valid credentials and sets cookie', async () => {
    await createAdmin();
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@vignak.test',
      password: 'StrongPassword123!',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('admin@vignak.test');
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('blocks unauthorized admin access', async () => {
    const res = await request(app).get('/api/admin/me');
    expect(res.status).toBe(401);
  });

  it('allows authenticated admin access', async () => {
    await createAdmin();
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({
      email: 'admin@vignak.test',
      password: 'StrongPassword123!',
    });
    const res = await agent.get('/api/admin/me');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
