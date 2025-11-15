require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  algorithm: 'HS256',
  issuer: 'SUFMS-API',
  audience: 'SUFMS-Client'
};
