const request = require('supertest');
const app = require('../src/app');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        email: `test${Date.now()}@example.com`,
        password: 'Password123!',
        user_type: 'Farmer',
        first_name: 'Test',
        last_name: 'User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
    });

    test('should fail with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123!',
        user_type: 'Farmer',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with short password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'short',
        user_type: 'Farmer',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      // First register a user
      const userData = {
        email: `testlogin${Date.now()}@example.com`,
        password: 'Password123!',
        user_type: 'Farmer',
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Then login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    test('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/me', () => {
    test('should return current user with valid token', async () => {
      // Register and get token
      const userData = {
        email: `testme${Date.now()}@example.com`,
        password: 'Password123!',
        user_type: 'Farmer',
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerResponse.body.token;

      // Get current user
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
    });

    test('should fail without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.statusCode).toBe(401);
    });

    test('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
    });
  });
});
