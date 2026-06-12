import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';
import config from './config';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { errorHandler, notFoundHandler } from './common/middlewares/error.middleware';
import { auditLog } from './common/middlewares/audit.middleware';
import logger from './common/utils/logger';

const app = express();

// Ensure upload directories exist
const uploadDirs = [
  config.upload.dir,
  path.join(config.upload.dir, 'properties'),
  path.join(config.upload.dir, 'brochures'),
  path.join(config.upload.dir, 'organizations'),
  config.logging.dir,
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting (disabled in development to avoid blocking local frontend hot-reload)
if (config.env !== 'development') {
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      message: { success: false, message: 'Too many requests, please try again later' },
    })
  );
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), config.upload.dir)));

// Audit logging
app.use(auditLog);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: `${config.appName} API Docs`,
  customCss: '.swagger-ui .topbar { display: none }',
}));

// API Routes
app.use(config.apiPrefix, routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
