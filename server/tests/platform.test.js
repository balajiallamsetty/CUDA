import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { ROLES, SERVICE_SLUGS, MILESTONE_STATUSES } from '@vignak/shared';

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

describe('Part 1 platform workflow', () => {
  it('creates service request, blocks IDOR, converts to work project with progress', async () => {
    const register = await request(app).post('/api/auth/register').send({
      name: 'Student A',
      email: 'studenta@example.com',
      password: 'StrongPassword123!',
      passwordConfirm: 'StrongPassword123!',
    });
    expect(register.status).toBe(201);

    const student = request.agent(app);
    await student.post('/api/auth/login').send({
      email: 'studenta@example.com',
      password: 'StrongPassword123!',
    });

    const created = await student.post('/api/auth/me/service-requests').send({
      title: 'GenAI Capstone',
      domain: 'generative-ai',
      description: 'Need help building a RAG demo for final year submission.',
      technologies: ['Python', 'React'],
    });
    expect(created.status).toBe(201);
    expect(created.body.data.domain).toBe('generative-ai');
    const requestId = created.body.data._id;

    await createUser({
      email: 'studentb@example.com',
      password: 'StrongPassword123!',
      role: ROLES.USER,
    });
    const other = await loginAgent('studentb@example.com', 'StrongPassword123!');
    const denied = await other.get(`/api/auth/me/service-requests/${requestId}`);
    expect(denied.status).toBe(404);

    await createUser({
      email: 'admin@example.com',
      password: 'StrongPassword123!',
      role: ROLES.ADMIN,
    });
    const admin = await loginAgent('admin@example.com', 'StrongPassword123!');
    const converted = await admin.post(`/api/admin/service-requests/${requestId}/convert`);
    expect(converted.status).toBe(201);
    expect(converted.body.data.serviceSlug).toBe(SERVICE_SLUGS.PROJECT_ASSISTANCE);
    const projectId = converted.body.data._id;

    const bundle = await student.get(`/api/auth/me/work-projects/${projectId}`);
    expect(bundle.status).toBe(200);
    expect(bundle.body.data.milestones.length).toBeGreaterThan(3);
    expect(bundle.body.data.project.progress).toBeGreaterThanOrEqual(0);

    const firstMs = bundle.body.data.milestones[0];
    await admin.post(`/api/admin/work-projects/${projectId}/milestones`).send({
      id: firstMs._id,
      status: MILESTONE_STATUSES.COMPLETED,
    });

    const after = await student.get(`/api/auth/me/work-projects/${projectId}`);
    expect(after.body.data.project.progress).toBeGreaterThan(0);

    const msg = await student.post(`/api/auth/me/work-projects/${projectId}/messages`).send({
      body: 'Hello team, sharing my constraints.',
    });
    expect(msg.status).toBe(201);

    const notes = await student.get('/api/auth/me/notifications');
    expect(notes.status).toBe(200);
    expect(notes.body.data.length).toBeGreaterThan(0);

    const otherProject = await other.get(`/api/auth/me/work-projects/${projectId}`);
    expect(otherProject.status).toBe(404);
  });

  it('allows admin to assign leads', async () => {
    await createUser({ email: 'sales@example.com', password: 'StrongPassword123!', role: ROLES.SALES });
    await createUser({ email: 'staff@example.com', password: 'StrongPassword123!', role: ROLES.STAFF });
    await request(app).post('/api/leads').send({
      name: 'Lead',
      email: 'lead@example.com',
      description: 'Anonymous interest in project assistance for college.',
      service: 'Project Assistance',
    });
    const sales = await loginAgent('sales@example.com', 'StrongPassword123!');
    const list = await sales.get('/api/admin/leads');
    const leadId = list.body.data[0]._id;
    const staff = await User.findOne({ email: 'staff@example.com' });
    const updated = await sales.patch(`/api/admin/leads/${leadId}`).send({ assignedTo: staff._id.toString() });
    expect(updated.status).toBe(200);
    expect(updated.body.data.assignedTo).toBeTruthy();
  });
});
