import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('TaskMind API Integration Tests', () => {
  const timestamp = Date.now();
  const user1 = {
    name: 'Test User One',
    email: `user1_${timestamp}@test.com`,
    password: 'password123',
  };
  const user2 = {
    name: 'Test User Two',
    email: `user2_${timestamp}@test.com`,
    password: 'password123',
  };

  let token1: string;
  let token2: string;
  let user1TaskId: number;

 describe('Health Checks', () => {
  it('GET /api/v1/health should return 200', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('API is healthy');
  });

  it('GET /api/v1/health/db should return connected', async () => {
    const res = await request(app).get('/api/v1/health/db');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Database connection is healthy');
  });
});

  describe('Authentication Flow', () => {
    it('Should register User 1', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(user1);
      expect(res.status).toBe(201);
      expect(res.body.data.token).toBeDefined();
      token1 = res.body.data.token;
    });

    it('Should reject duplicate email with 409', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(user1);
      expect(res.status).toBe(409);
    });

    it('Should login and return token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user1.email, password: user1.password });
      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('Should register User 2', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(user2);
      expect(res.status).toBe(201);
      token2 = res.body.data.token;
    });

    it('Should return current user profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token1}`);
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(user1.email.toLowerCase());
    });
  });

  describe('Tasks & Multi-User Isolation', () => {
    it('User 1 creates a task', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token1}`)
        .send({ title: 'User 1 Confidential Task', priority: 'HIGH', category: 'Work' });
      expect(res.status).toBe(201);
      user1TaskId = res.body.data.task.id;
    });

    it('User 2 should NOT see User 1 tasks', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${token2}`);
      expect(res.status).toBe(200);
      expect(res.body.data.tasks.length).toBe(0);
    });

    it('User 2 accessing User 1 task should return 403', async () => {
      const res = await request(app)
        .get(`/api/v1/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${token2}`);
      expect(res.status).toBe(403);
    });

    it('User 2 modifying User 1 task should return 403', async () => {
      const res = await request(app)
        .put(`/api/v1/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ title: 'Hacked Title' });
      expect(res.status).toBe(403);
    });

    it('User 1 deletes their own task', async () => {
      const res = await request(app)
        .delete(`/api/v1/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${token1}`);
      expect(res.status).toBe(200);
    });
  });
});