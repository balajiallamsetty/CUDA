import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Lead } from '../src/models/Lead.js';
import { Project } from '../src/models/Project.js';
import { ROLES } from '@vignak/shared';

let mongo;
let app;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_value_1234567890ab';
  process.env.CLIENT_URL = 'http://localhost:5173';
  delete process.env.SMTP_HOST;
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

async function createUser({ email, password, role, name = 'Test' }) {
  const passwordHash = await User.hashPassword(password);
  return User.create({ name, email, passwordHash, role });
}

async function loginAgent(email, password) {
  const agent = request.agent(app);
  await agent.post('/api/auth/login').send({ email, password });
  return agent;
}

describe('Phase 3 security regressions', () => {
  it('health is liveness-only; ready reports DB', async () => {
    const health = await request(app).get('/api/health');
    expect(health.status).toBe(200);
    expect(health.body.database).toBeUndefined();

    const ready = await request(app).get('/api/ready');
    expect(ready.status).toBe(200);
    expect(ready.body.status).toBe('ready');
  });

  it('STAFF cannot list other users leads via assignedTo query (IDOR)', async () => {
    const staff = await createUser({
      email: 'staff@test.com',
      password: 'StrongPassword123!',
      role: ROLES.STAFF,
    });
    const other = await createUser({
      email: 'sales@test.com',
      password: 'StrongPassword123!',
      role: ROLES.SALES,
    });
    await Lead.create({
      name: 'Other Lead',
      email: 'otherlead@example.com',
      service: 'Website',
      description: 'Lead assigned to sales — staff must not see via query override.',
      assignedTo: other._id,
    });
    await Lead.create({
      name: 'Staff Lead',
      email: 'stafflead@example.com',
      service: 'Website',
      description: 'Lead assigned to the staff member under test.',
      assignedTo: staff._id,
    });

    const agent = await loginAgent('staff@test.com', 'StrongPassword123!');
    const spoof = await agent.get(`/api/admin/leads?assignedTo=${other._id}`);
    expect(spoof.status).toBe(200);
    expect(spoof.body.data.every((l) => l.assignedTo?._id === staff._id.toString() || l.assignedTo === staff._id.toString())).toBe(true);
    expect(spoof.body.data.some((l) => l.email === 'otherlead@example.com')).toBe(false);
    expect(spoof.body.data.some((l) => l.email === 'stafflead@example.com')).toBe(true);
  });

  it('rejects Mongo operator injection in list filters', async () => {
    await createUser({
      email: 'admin@test.com',
      password: 'StrongPassword123!',
      role: ROLES.ADMIN,
    });
    const agent = await loginAgent('admin@test.com', 'StrongPassword123!');
    const res = await agent.get('/api/admin/leads').query({ status: { $ne: 'CLOSED' } });
    expect(res.status).toBe(400);
  });

  it('rejects JWT after password change', async () => {
    await createUser({
      email: 'changer@test.com',
      password: 'StrongPassword123!',
      role: ROLES.ADMIN,
    });
    const agent = await loginAgent('changer@test.com', 'StrongPassword123!');
    const before = await agent.get('/api/admin/me');
    expect(before.status).toBe(200);

    // Ensure passwordChangedAt is strictly after JWT iat (second resolution)
    await new Promise((r) => setTimeout(r, 1100));
    const changed = await agent.post('/api/auth/change-password').send({
      currentPassword: 'StrongPassword123!',
      newPassword: 'EvenStrongerPassword456!',
    });
    expect(changed.status).toBe(200);

    const after = await agent.get('/api/admin/me');
    expect(after.status).toBe(401);
  });

  it('ignores mass-assigned privileged fields on project create', async () => {
    await createUser({
      email: 'content@test.com',
      password: 'StrongPassword123!',
      role: ROLES.CONTENT_MANAGER,
    });
    const agent = await loginAgent('content@test.com', 'StrongPassword123!');
    const create = await agent.post('/api/admin/projects').send({
      title: 'Mass Assign Test',
      category: 'Web',
      description: 'Ensures unknown fields cannot be injected into Project documents.',
      published: true,
      __proto__: { polluted: true },
      role: 'SUPER_ADMIN',
      passwordHash: 'hacked',
      createdBy: '000000000000000000000001',
    });
    expect(create.status).toBe(201);
    const id = create.body.data._id;
    const doc = await Project.findById(id).lean();
    expect(doc.passwordHash).toBeUndefined();
    expect(doc.role).toBeUndefined();
  });

  it('USER and SALES respect permission boundaries', async () => {
    await createUser({
      email: 'user@test.com',
      password: 'StrongPassword123!',
      role: ROLES.USER,
    });
    await createUser({
      email: 'sales@test.com',
      password: 'StrongPassword123!',
      role: ROLES.SALES,
    });

    const userAgent = await loginAgent('user@test.com', 'StrongPassword123!');
    expect((await userAgent.get('/api/admin/users')).status).toBe(403);

    const salesAgent = await loginAgent('sales@test.com', 'StrongPassword123!');
    expect((await salesAgent.get('/api/admin/leads')).status).toBe(200);
    expect((await salesAgent.get('/api/admin/users')).status).toBe(403);
    expect((await salesAgent.post('/api/admin/projects').send({
      title: 'Nope',
      category: 'Web',
      description: 'Sales should not create projects.',
    })).status).toBe(403);
  });
});
