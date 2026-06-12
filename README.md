# Real Estate CRM Backend

Production-grade Real Estate CRM backend API built with Node.js, TypeScript, PostgreSQL, Prisma ORM, Redis, and BullMQ.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL 16 |
| ORM | Prisma 5 |
| Cache/Queue | Redis 7 + BullMQ |
| Auth | JWT (Access + Refresh Tokens) |
| Validation | class-validator |
| Documentation | Swagger/OpenAPI 3.0 |
| Logging | Winston |
| Containerization | Docker |

## Architecture

```
src/
├── config/           # App configuration, DB, Redis, Swagger
├── common/           # Shared utilities, middleware, DTOs, errors
│   ├── dto/
│   ├── errors/
│   ├── interfaces/
│   ├── middlewares/
│   └── utils/
├── modules/          # Feature modules (Repository + Service + Controller)
│   ├── auth/
│   ├── users/
│   ├── leads/
│   ├── properties/
│   ├── projects/
│   ├── site-visits/
│   ├── bookings/
│   ├── lead-sources/
│   ├── notifications/
│   └── reports/
├── jobs/             # BullMQ queues and workers
│   ├── queues/
│   └── workers/
├── routes/           # Route aggregator
├── app.ts            # Express app setup
└── server.ts         # Server bootstrap
```

Each module follows the **Repository → Service → Controller** pattern with DTO validation.

## Modules

| Module | Features |
|--------|----------|
| **Authentication** | Login, Logout, Refresh Token, Change/Forgot Password |
| **User Management** | CRUD Users, Roles, Permissions (RBAC) |
| **Lead Management** | CRUD, Assign, Status Tracking, Notes, Timeline |
| **Property Management** | CRUD, Image Upload, Brochure Upload, Inventory |
| **Project Management** | Builders, Projects, Towers, Units |
| **Site Visits** | Schedule, Feedback, Status Tracking |
| **Bookings** | Create, Status, Payment Tracking |
| **Lead Sources** | Website, Facebook, Google, WhatsApp, Manual Entry |
| **Notifications** | Email, SMS, WhatsApp (via BullMQ) |
| **Reports** | Lead Conversion, Sales, Revenue, Agent Performance |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker (optional)

### Local Development

```bash
# Clone and install
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database and Redis credentials

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (creates admin user, roles, permissions, lead sources)
npm run prisma:seed

# Start development server
npm run dev
```

### Docker

```bash
docker-compose up -d
```

This starts PostgreSQL, Redis, and the API server.

## Default Credentials

After seeding:

- **Email:** admin@realestatecrm.com
- **Password:** Admin@123

## API Documentation

Swagger UI is available at: `http://localhost:3000/api-docs`

## Environment Variables

See [`.env.example`](.env.example) for all configuration options.

Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_HOST` | Redis host |
| `JWT_ACCESS_SECRET` | JWT access token secret |
| `JWT_REFRESH_SECRET` | JWT refresh token secret |
| `SMTP_*` | Email configuration |
| `SMS_*` | SMS provider configuration |
| `WHATSAPP_*` | WhatsApp API configuration |

## API Endpoints

### Authentication
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/change-password`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET  /api/v1/auth/me`

### Users & Roles
- `GET/POST/PUT/DELETE /api/v1/users`
- `GET/POST/PUT/DELETE /api/v1/roles`
- `GET /api/v1/roles/permissions`

### Leads
- `GET/POST/PUT/DELETE /api/v1/leads`
- `PATCH /api/v1/leads/:id/assign`
- `POST /api/v1/leads/:id/notes`
- `GET /api/v1/leads/:id/timeline`

### Properties
- `GET/POST/PUT/DELETE /api/v1/properties`
- `POST /api/v1/properties/:id/images`
- `POST /api/v1/properties/:id/brochure`
- `GET /api/v1/properties/inventory`

### Projects
- `GET/POST/PUT/DELETE /api/v1/projects`
- `GET/POST/PUT/DELETE /api/v1/projects/builders`
- `POST /api/v1/projects/:projectId/towers`
- `POST /api/v1/projects/towers/:towerId/units`

### Site Visits
- `GET/POST/PUT/DELETE /api/v1/site-visits`
- `POST /api/v1/site-visits/:id/feedback`

### Bookings
- `GET/POST/PUT/DELETE /api/v1/bookings`
- `POST /api/v1/bookings/:id/payments`

### Reports
- `GET /api/v1/reports/lead-conversion`
- `GET /api/v1/reports/sales`
- `GET /api/v1/reports/revenue`
- `GET /api/v1/reports/agent-performance`

## Features

- **Pagination, Search, Filtering, Sorting** on all list endpoints
- **Soft Deletes** across all entities
- **Audit Logs** for write operations
- **Global Error Handling** with structured error responses
- **Winston Logging** with file and console transports
- **Rate Limiting** to prevent abuse
- **Role-Based Access Control** with granular permissions
- **Background Job Processing** for notifications via BullMQ

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed database |
| `npm run prisma:studio` | Open Prisma Studio |

## License

MIT
# BrisavoRealEstateCRMBackend
