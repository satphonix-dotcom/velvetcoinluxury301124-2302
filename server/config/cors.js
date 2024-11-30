const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://*.netlify.app']
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-auth-token',
    'Origin',
    'Accept'
  ],
  exposedHeaders: ['x-auth-token'],
  maxAge: 86400 // 24 hours
};

module.exports = corsOptions;