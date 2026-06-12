import swaggerJsdoc from 'swagger-jsdoc';
import config from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: `${config.appName} API`,
      version: '1.0.0',
      description: 'Production-grade Real Estate CRM Backend API Documentation',
      contact: {
        name: 'API Support',
        email: 'support@realestatecrm.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.apiPrefix}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 10 },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Roles', description: 'Role and permission management' },
      { name: 'Leads', description: 'Lead management' },
      { name: 'Lead Sources', description: 'Lead source management' },
      { name: 'Properties', description: 'Property management' },
      { name: 'Projects', description: 'Project management' },
      { name: 'Builders', description: 'Builder management' },
      { name: 'Site Visits', description: 'Site visit management' },
      { name: 'Bookings', description: 'Booking management' },
      { name: 'Notifications', description: 'Notification management' },
      { name: 'Reports', description: 'Reports and analytics' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
