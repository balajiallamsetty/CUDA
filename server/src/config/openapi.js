export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Vignak Solutions API',
    version: '2.0.0',
    description: 'Phase 2 business operating API',
  },
  servers: [{ url: 'http://localhost:5000' }],
  paths: {
    '/api/health': {
      get: { summary: 'Health check', responses: { 200: { description: 'OK' } } },
    },
    '/api/auth/login': {
      post: { summary: 'Login', responses: { 200: { description: 'Logged in' } } },
    },
    '/api/admin/dashboard/stats': {
      get: { summary: 'Dashboard stats', responses: { 200: { description: 'Stats' } } },
    },
    '/api/projects': {
      get: { summary: 'Public projects', responses: { 200: { description: 'List' } } },
    },
    '/api/talks': {
      get: { summary: 'Public talks', responses: { 200: { description: 'List' } } },
    },
  },
};
