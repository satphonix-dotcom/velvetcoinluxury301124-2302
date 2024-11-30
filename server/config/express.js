const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const corsOptions = require('./cors');
const { errorHandler, notFound } = require('../middleware/errorHandler');
const routes = require('../routes');

const configureExpress = (app) => {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https:", "wss:"],
        imgSrc: ["'self'", "https:", "data:", "blob:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "https:", "data:"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
  }));

  // CORS configuration
  app.use(cors(corsOptions));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api/', limiter);

  // Request parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(compression());

  // Logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // API routes
  app.use('/api', routes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = configureExpress;