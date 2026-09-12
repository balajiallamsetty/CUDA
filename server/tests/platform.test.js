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
}, 180000);

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

describe('Part 2 multi-service ecosystem', () => {
  it('lists catalog services and rejects inactive service requests', async () => {
    const catalog = await request(app).get('/api/catalog/services');
    expect(catalog.status).toBe(200);
    expect(catalog.body.data.length).toBeGreaterThanOrEqual(13);

    await createUser({ email: 'admin2@example.com', password: 'StrongPassword123!', role: ROLES.ADMIN });
    const admin = await loginAgent('admin2@example.com', 'StrongPassword123!');
    await admin.patch('/api/admin/service-definitions/joy-box').send({ active: false });

    await request(app).post('/api/auth/register').send({
      name: 'Biz',
      email: 'biz@example.com',
      password: 'StrongPassword123!',
      passwordConfirm: 'StrongPassword123!',
      customerType: 'BUSINESS',
    });
    const biz = request.agent(app);
    await biz.post('/api/auth/login').send({ email: 'biz@example.com', password: 'StrongPassword123!' });

    const denied = await biz.post('/api/auth/me/service-requests').send({
      serviceSlug: SERVICE_SLUGS.JOY_BOX,
      title: 'Joy box order',
      description: 'Need 20 boxes',
      packageType: 'Standard',
      quantity: '20',
    });
    expect(denied.status).toBe(400);
  });

  it('quotation → approve → convert path and IDOR on deliverables/payments/internal notes', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Client A',
      email: 'clienta@example.com',
      password: 'StrongPassword123!',
      passwordConfirm: 'StrongPassword123!',
      customerType: 'BUSINESS',
    });
    await request(app).post('/api/auth/register').send({
      name: 'Client B',
      email: 'clientb@example.com',
      password: 'StrongPassword123!',
      passwordConfirm: 'StrongPassword123!',
    });
    await createUser({ email: 'ops@example.com', password: 'StrongPassword123!', role: ROLES.ADMIN });

    const clientA = request.agent(app);
    await clientA.post('/api/auth/login').send({ email: 'clienta@example.com', password: 'StrongPassword123!' });
    const clientB = await loginAgent('clientb@example.com', 'StrongPassword123!');
    const admin = await loginAgent('ops@example.com', 'StrongPassword123!');

    const created = await clientA.post('/api/auth/me/service-requests').send({
      serviceSlug: SERVICE_SLUGS.WEB_DEVELOPMENT,
      title: 'Marketing site',
      description: 'Need a company website with CMS.',
      organization: 'Acme',
    });
    expect(created.status).toBe(201);
    const requestId = created.body.data._id;

    const directConvert = await admin.post(`/api/admin/service-requests/${requestId}/convert`);
    expect(directConvert.status).toBe(400);

    const quote = await admin.post(`/api/admin/service-requests/${requestId}/quotations`).send({
      send: true,
      lineItems: [{ description: 'Website build', quantity: 1, unitAmount: 50000, amount: 50000 }],
    });
    expect(quote.status).toBe(201);
    const quoteId = quote.body.data._id;

    const stolenQuote = await clientB.get(`/api/auth/me/quotations/${quoteId}`);
    expect(stolenQuote.status).toBe(404);

    const approved = await clientA.post(`/api/auth/me/quotations/${quoteId}/approve`);
    expect(approved.status).toBe(200);

    let projectId;
    const afterApprove = await admin.get(`/api/admin/service-requests/${requestId}`);
    if (afterApprove.body.data.workProject) {
      projectId = afterApprove.body.data.workProject._id || afterApprove.body.data.workProject;
    } else {
      const converted = await admin.post(`/api/admin/service-requests/${requestId}/convert`);
      expect(converted.status).toBe(201);
      projectId = converted.body.data._id;
    }
    expect(projectId).toBeTruthy();

    const deliv = await admin.post(`/api/admin/work-projects/${projectId}/deliverables`).send({
      title: 'Staging URL',
      submit: true,
      type: 'staging',
    });
    expect(deliv.status).toBe(201);
    const delivId = deliv.body.data._id;

    const stolenDeliv = await clientB.get(`/api/auth/me/deliverables/${delivId}`);
    expect(stolenDeliv.status).toBe(404);

    const approveDeliv = await clientA.post(`/api/auth/me/deliverables/${delivId}/approve`);
    expect(approveDeliv.status).toBe(200);

    const pay = await admin.post('/api/admin/payments').send({
      workProject: projectId,
      amount: 25000,
      status: 'PAID',
    });
    expect(pay.status).toBe(201);
    const payId = pay.body.data._id;
    const stolenPay = await clientB.get(`/api/auth/me/payments/${payId}`);
    expect(stolenPay.status).toBe(404);

    await admin.post(`/api/admin/work-projects/${projectId}/messages`).send({
      body: 'Internal margin note',
      visibility: 'INTERNAL',
    });
    await admin.post(`/api/admin/work-projects/${projectId}/messages`).send({
      body: 'Hello client',
      visibility: 'CLIENT',
    });

    const bundle = await clientA.get(`/api/auth/me/work-projects/${projectId}`);
    expect(bundle.status).toBe(200);
    const bodies = (bundle.body.data.messages || []).map((m) => m.body);
    expect(bodies).toContain('Hello client');
    expect(bodies).not.toContain('Internal margin note');
  });
});
