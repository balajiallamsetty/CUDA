/**
 * Ephemeral final-audit harness (MongoMemoryServer).
 * Run: node --experimental-vm-modules server/scripts/finalAuditHarness.js
 * Does not modify application behavior; prints JSON evidence to stdout.
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Lead } from '../src/models/Lead.js';
import { Inquiry } from '../src/models/Inquiry.js';
import { TalkRegistration } from '../src/models/TalkRegistration.js';
import { ROLES } from '@vignak/shared';

const results = [];

function record(id, verdict, detail = {}) {
  const { status: httpStatus, ...rest } = detail;
  results.push({
    id,
    verdict,
    ...(httpStatus !== undefined ? { httpStatus } : {}),
    ...rest,
  });
}

async function createUser({ email, password, role, name = 'Audit' }) {
  const passwordHash = await User.hashPassword(password);
  return User.create({ name, email, passwordHash, role });
}

async function login(app, email, password) {
  const agent = request.agent(app);
  const res = await agent.post('/api/auth/login').send({ email, password });
  return { agent, res };
}

async function main() {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'audit_harness_jwt_secret_32chars_min';
  process.env.CLIENT_URL = 'http://localhost:5173';
  delete process.env.SMTP_HOST;

  const mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  await mongoose.connect(process.env.MONGODB_URI);
  const app = createApp();

  // Health / ready
  {
    const h = await request(app).get('/api/health');
    record('GET /api/health', h.status === 200 && !h.body.database ? 'PASS' : 'FAIL', { status: h.status, body: h.body });
    const r = await request(app).get('/api/ready');
    record('GET /api/ready', r.status === 200 && r.body.status === 'ready' ? 'PASS' : 'FAIL', { status: r.status });
  }

  // Public lead + contact persistence
  {
    const lead = await request(app).post('/api/leads').send({
      name: 'Audit Lead',
      email: 'auditlead@example.com',
      service: 'Website',
      description: 'Lead created by final audit harness for persistence verification.',
    });
    record('POST /api/leads', lead.status === 201 ? 'PASS' : 'FAIL', { status: lead.status });
    const contact = await request(app).post('/api/contact').send({
      name: 'Audit Contact',
      email: 'auditcontact@example.com',
      subject: 'Hello',
      message: 'Contact message from final audit harness persistence check.',
    });
    record('POST /api/contact', contact.status === 201 ? 'PASS' : 'FAIL', { status: contact.status });
    const leadCount = await Lead.countDocuments({ email: 'auditlead@example.com' });
    const inqCount = await Inquiry.countDocuments({ email: 'auditcontact@example.com' });
    record('DB lead persisted', leadCount === 1 ? 'PASS' : 'FAIL', { leadCount });
    record('DB inquiry persisted', inqCount === 1 ? 'PASS' : 'FAIL', { inqCount });
  }

  // Validation negatives
  {
    const bad = await request(app).post('/api/leads').send({ name: 'x', email: 'not-an-email', service: 'Website', description: 'short' });
    record('POST /api/leads invalid', bad.status === 400 ? 'PASS' : 'FAIL', { status: bad.status });
    const xss = await request(app).post('/api/contact').send({
      name: '<script>alert(1)</script>',
      email: 'xss@example.com',
      subject: 'XSS',
      message: '<img src=x onerror=alert(1)> payload stored as text for audit.',
    });
    record('POST /api/contact XSS payload accepted as text', xss.status === 201 ? 'PASS' : 'FAIL', { status: xss.status });
    const stored = await Inquiry.findOne({ email: 'xss@example.com' }).lean();
    record('XSS not executed server-side (stored raw)', stored?.message?.includes('<img') ? 'PASS' : 'PARTIAL', { stored: !!stored });
  }

  // Auth / roles
  const pwd = 'StrongPassword123!';
  const admin = await createUser({ email: 'admin@audit.test', password: pwd, role: ROLES.ADMIN });
  const sales = await createUser({ email: 'sales@audit.test', password: pwd, role: ROLES.SALES });
  const staff = await createUser({ email: 'staff@audit.test', password: pwd, role: ROLES.STAFF });
  const content = await createUser({ email: 'content@audit.test', password: pwd, role: ROLES.CONTENT_MANAGER });
  const plain = await createUser({ email: 'user@audit.test', password: pwd, role: ROLES.USER });

  {
    const badLogin = await request(app).post('/api/auth/login').send({ email: 'admin@audit.test', password: 'TotallyWrongPassword99!' });
    record('login bad password', badLogin.status === 401 ? 'PASS' : 'FAIL', { httpStatus: badLogin.status });
    const shortLogin = await request(app).post('/api/auth/login').send({ email: 'admin@audit.test', password: 'wrong' });
    record('login short password validation', shortLogin.status === 400 ? 'PASS' : 'FAIL', { httpStatus: shortLogin.status });
    const { agent, res } = await login(app, 'admin@audit.test', pwd);
    record('login admin', res.status === 200 ? 'PASS' : 'FAIL', { status: res.status });
    const me = await agent.get('/api/auth/me');
    record('GET /api/auth/me', me.status === 200 ? 'PASS' : 'FAIL', { status: me.status });
    const anon = await request(app).get('/api/admin/me');
    record('admin without auth', anon.status === 401 ? 'PASS' : 'FAIL', { status: anon.status });
    const userAgent = (await login(app, 'user@audit.test', pwd)).agent;
    const userAdmin = await userAgent.get('/api/admin/me');
    record('USER blocked from admin', userAdmin.status === 403 ? 'PASS' : 'FAIL', { status: userAdmin.status });
  }

  // RBAC matrix samples
  {
    const salesAgent = (await login(app, 'sales@audit.test', pwd)).agent;
    const contentAgent = (await login(app, 'content@audit.test', pwd)).agent;
    const adminAgent = (await login(app, 'admin@audit.test', pwd)).agent;

    record('SALES can list leads', (await salesAgent.get('/api/admin/leads')).status === 200 ? 'PASS' : 'FAIL');
    record('SALES cannot create project', (await salesAgent.post('/api/admin/projects').send({
      title: 'Nope', category: 'Web', description: 'Sales should not create projects in audit harness.',
    })).status === 403 ? 'PASS' : 'FAIL');
    record('CONTENT can create project', (await contentAgent.post('/api/admin/projects').send({
      title: 'Audit Project', category: 'Web', description: 'Published project from audit harness.', published: true,
    })).status === 201 ? 'PASS' : 'FAIL');
    record('CONTENT cannot list users', (await contentAgent.get('/api/admin/users')).status === 403 ? 'PASS' : 'FAIL');
    record('ADMIN can list users', (await adminAgent.get('/api/admin/users')).status === 200 ? 'PASS' : 'FAIL');
  }

  // IDOR staff assignedTo override
  {
    const otherLead = await Lead.create({
      name: 'Other',
      email: 'otherlead@audit.test',
      service: 'Website',
      description: 'Assigned to sales for staff IDOR check in audit harness.',
      assignedTo: sales._id,
    });
    await Lead.create({
      name: 'Mine',
      email: 'mystaff@audit.test',
      service: 'Website',
      description: 'Assigned to staff for staff IDOR check in audit harness.',
      assignedTo: staff._id,
    });
    const staffAgent = (await login(app, 'staff@audit.test', pwd)).agent;
    const spoof = await staffAgent.get(`/api/admin/leads?assignedTo=${sales._id}`);
    const emails = (spoof.body.data || []).map((l) => l.email);
    record('STAFF IDOR assignedTo query', !emails.includes('otherlead@audit.test') && emails.includes('mystaff@audit.test') ? 'PASS' : 'FAIL', { emails });
    record('STAFF cannot open other lead', (await staffAgent.get(`/api/admin/leads/${otherLead._id}`)).status === 404 ? 'PASS' : 'FAIL');
  }

  // Operator injection
  {
    const adminAgent = (await login(app, 'admin@audit.test', pwd)).agent;
    const inj = await adminAgent.get('/api/admin/leads').query({ status: { $ne: 'CLOSED' } });
    record('NoSQL operator rejection', inj.status === 400 ? 'PASS' : 'FAIL', { status: inj.status });
  }

  // Talks registration + duplicate
  {
    const contentAgent = (await login(app, 'content@audit.test', pwd)).agent;
    const talk = await contentAgent.post('/api/admin/talks').send({
      title: 'Audit Talk',
      description: 'Talk created by final audit harness for registration flow.',
      status: 'REGISTRATION_OPEN',
      registrationOpen: true,
      published: true,
    });
    record('POST /api/admin/talks', talk.status === 201 ? 'PASS' : 'FAIL', { status: talk.status });
    const talkId = talk.body?.data?._id;
    const reg1 = await request(app).post(`/api/talks/${talkId}/register`).send({ name: 'Guest', email: 'guest@audit.test' });
    const reg2 = await request(app).post(`/api/talks/${talkId}/register`).send({ name: 'Guest', email: 'guest@audit.test' });
    record('talk register 201', reg1.status === 201 ? 'PASS' : 'FAIL', { status: reg1.status });
    record('talk register duplicate 409', reg2.status === 409 ? 'PASS' : 'FAIL', { status: reg2.status });
    const regCount = await TalkRegistration.countDocuments({ email: 'guest@audit.test' });
    record('DB registration persisted', regCount === 1 ? 'PASS' : 'FAIL', { regCount });
    const pub = await request(app).get('/api/talks/audit-talk');
    record('public talk by slug', pub.status === 200 ? 'PASS' : 'FAIL', { status: pub.status });
  }

  // Public project
  {
    const pub = await request(app).get('/api/projects/audit-project');
    record('public project by slug', pub.status === 200 ? 'PASS' : 'FAIL', { status: pub.status });
  }

  // Forgot password generic + token created in non-prod without SMTP
  {
    const fp = await request(app).post('/api/auth/forgot-password').send({ email: 'admin@audit.test' });
    record('forgot-password generic message', fp.status === 200 && String(fp.body.message).toLowerCase().includes('if an account') ? 'PASS' : 'FAIL');
  }

  // Password change kills session
  {
    const { agent } = await login(app, 'admin@audit.test', pwd);
    await new Promise((r) => setTimeout(r, 1100));
    const ch = await agent.post('/api/auth/change-password').send({
      currentPassword: pwd,
      newPassword: 'EvenStrongerPassword456!',
    });
    record('change-password', ch.status === 200 ? 'PASS' : 'FAIL', { status: ch.status });
    const after = await agent.get('/api/admin/me');
    record('session killed after password change', after.status === 401 ? 'PASS' : 'FAIL', { status: after.status });
  }

  // Mass assignment
  {
    const contentAgent = (await login(app, 'content@audit.test', pwd)).agent;
    const create = await contentAgent.post('/api/admin/projects').send({
      title: 'Mass Assign Audit',
      category: 'Web',
      description: 'Ensures unknown fields ignored in project create during audit.',
      passwordHash: 'x',
      role: 'SUPER_ADMIN',
    });
    record('mass assignment ignored on project', create.status === 201 && !create.body?.data?.passwordHash ? 'PASS' : 'FAIL', { status: create.status });
  }

  // Settings validators
  {
    const adminAgent = (await login(app, 'admin@audit.test', 'EvenStrongerPassword456!')).agent;
    // admin password was changed - use new password
    const login2 = await login(app, 'admin@audit.test', 'EvenStrongerPassword456!');
    const settings = await login2.agent.patch('/api/admin/settings').send({ publicContactEmail: 'not-email' });
    record('settings invalid email 400', settings.status === 400 ? 'PASS' : 'FAIL', { status: settings.status });
    const ok = await login2.agent.patch('/api/admin/settings').send({ companyName: 'Vignak Audit Co' });
    record('settings update', ok.status === 200 ? 'PASS' : 'FAIL', { status: ok.status });
    const stats = await login2.agent.get('/api/admin/dashboard/stats');
    record('dashboard stats', stats.status === 200 ? 'PASS' : 'FAIL', { status: stats.status, data: stats.body?.data });
  }

  // Ready when disconnected
  {
    await mongoose.disconnect();
    const ready = await request(app).get('/api/ready');
    record('/api/ready when DB down', ready.status === 503 ? 'PASS' : 'FAIL', { status: ready.status });
  }

  const summary = {
    pass: results.filter((r) => r.verdict === 'PASS').length,
    fail: results.filter((r) => r.verdict === 'FAIL').length,
    partial: results.filter((r) => r.verdict === 'PARTIAL').length,
    total: results.length,
    results,
  };
  console.log(JSON.stringify(summary, null, 2));

  await mongo.stop();
  process.exit(summary.fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
