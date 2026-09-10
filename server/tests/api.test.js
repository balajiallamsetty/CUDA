import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Project } from '../src/models/Project.js';
import { Talk } from '../src/models/Talk.js';
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

async function createUser({ email, password, role }) {
  const passwordHash = await User.hashPassword(password);
  return User.create({ name: 'Test', email, passwordHash, role });
}

async function loginAgent(email, password) {
  const agent = request.agent(app);
  await agent.post('/api/auth/login').send({ email, password });
  return agent;
}

describe('Phase 2 API', () => {
  it('health works', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('creates leads and lists them for sales', async () => {
    await createUser({ email: 'sales@test.com', password: 'StrongPassword123!', role: ROLES.SALES });
    await request(app).post('/api/leads').send({
      name: 'Lead',
      email: 'lead@example.com',
      service: 'Website',
      description: 'Need a website for our college admissions team.',
    });
    const agent = await loginAgent('sales@test.com', 'StrongPassword123!');
    const res = await agent.get('/api/admin/leads');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it('blocks USER from admin', async () => {
    await createUser({ email: 'user@test.com', password: 'StrongPassword123!', role: ROLES.USER });
    const agent = await loginAgent('user@test.com', 'StrongPassword123!');
    const res = await agent.get('/api/admin/me');
    expect(res.status).toBe(403);
  });

  it('allows content manager to create project and publish publicly', async () => {
    await createUser({
      email: 'content@test.com',
      password: 'StrongPassword123!',
      role: ROLES.CONTENT_MANAGER,
    });
    const agent = await loginAgent('content@test.com', 'StrongPassword123!');
    const create = await agent.post('/api/admin/projects').send({
      title: 'Public Project',
      category: 'Web',
      description: 'A published project for the portfolio.',
      published: true,
    });
    expect(create.status).toBe(201);
    const pub = await request(app).get('/api/projects/public-project');
    expect(pub.status).toBe(200);
    expect(pub.body.data.title).toBe('Public Project');
  });

  it('registers for open talks and rejects duplicates', async () => {
    const talk = await Talk.create({
      title: 'Open Talk',
      slug: 'open-talk',
      description: 'A talk with registration open for attendees.',
      status: 'REGISTRATION_OPEN',
      registrationOpen: true,
      published: true,
    });
    const first = await request(app).post(`/api/talks/${talk._id}/register`).send({
      name: 'Guest',
      email: 'guest@example.com',
    });
    expect(first.status).toBe(201);
    const second = await request(app).post(`/api/talks/${talk._id}/register`).send({
      name: 'Guest',
      email: 'guest@example.com',
    });
    expect(second.status).toBe(409);
  });

  it('forgot password always returns generic success', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nobody@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.message.toLowerCase()).toContain('if an account exists');
  });

  it('staff cannot see unassigned leads (IDOR)', async () => {
    const staff = await createUser({
      email: 'staff@test.com',
      password: 'StrongPassword123!',
      role: ROLES.STAFF,
    });
    const other = await createUser({
      email: 'other@test.com',
      password: 'StrongPassword123!',
      role: ROLES.SALES,
    });
    await request(app).post('/api/leads').send({
      name: 'Owned',
      email: 'owned@example.com',
      service: 'Website',
      description: 'Assigned later to sales only for isolation checks.',
    });
    const sales = await loginAgent('other@test.com', 'StrongPassword123!');
    const list = await sales.get('/api/admin/leads');
    const leadId = list.body.data[0]._id;
    await sales.patch(`/api/admin/leads/${leadId}`).send({ assignedTo: other._id.toString() });

    const staffAgent = await loginAgent('staff@test.com', 'StrongPassword123!');
    const denied = await staffAgent.get(`/api/admin/leads/${leadId}`);
    expect(denied.status).toBe(404);
    expect(staff._id).toBeDefined();
  });

  it('updates lead status with history', async () => {
    await createUser({ email: 'admin@test.com', password: 'StrongPassword123!', role: ROLES.ADMIN });
    await request(app).post('/api/leads').send({
      name: 'Status Lead',
      email: 'status@example.com',
      service: 'Website',
      description: 'Lead used for status transition testing.',
    });
    const agent = await loginAgent('admin@test.com', 'StrongPassword123!');
    const list = await agent.get('/api/admin/leads');
    const id = list.body.data[0]._id;
    const updated = await agent.patch(`/api/admin/leads/${id}`).send({ status: 'CONTACTED' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.status).toBe('CONTACTED');
    expect(updated.body.data.statusHistory.length).toBeGreaterThan(0);
  });
});
