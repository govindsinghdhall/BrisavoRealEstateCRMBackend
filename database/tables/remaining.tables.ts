import { defineTable } from '../types';

/** Child / supporting tables (inherit tenant scope via parent relations) */

export const refreshTokensTable = defineTable({
  model: 'RefreshToken',
  table: 'refresh_tokens',
  description: 'JWT refresh tokens (scoped via user)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'token', dbColumn: 'token', type: 'STRING', unique: true, indexed: true },
    { name: 'userId', dbColumn: 'user_id', type: 'UUID', indexed: true, foreignKey: { table: 'users', column: 'id' } },
    { name: 'expiresAt', dbColumn: 'expires_at', type: 'DATETIME' },
    { name: 'isRevoked', dbColumn: 'is_revoked', type: 'BOOLEAN', default: 'false' },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
  ],
});

export const passwordResetsTable = defineTable({
  model: 'PasswordReset',
  table: 'password_resets',
  description: 'Password reset tokens (scoped via user)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'token', dbColumn: 'token', type: 'STRING', unique: true, indexed: true },
    { name: 'userId', dbColumn: 'user_id', type: 'UUID', foreignKey: { table: 'users', column: 'id' } },
    { name: 'expiresAt', dbColumn: 'expires_at', type: 'DATETIME' },
    { name: 'isUsed', dbColumn: 'is_used', type: 'BOOLEAN', default: 'false' },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
  ],
});

export const leadNotesTable = defineTable({
  model: 'LeadNote',
  table: 'lead_notes',
  description: 'Notes on leads (tenant via lead)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'content', dbColumn: 'content', type: 'TEXT' },
    { name: 'leadId', dbColumn: 'lead_id', type: 'UUID', indexed: true, foreignKey: { table: 'leads', column: 'id' } },
    { name: 'createdById', dbColumn: 'created_by_id', type: 'UUID', foreignKey: { table: 'users', column: 'id' } },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
    { name: 'deletedAt', dbColumn: 'deleted_at', type: 'DATETIME', nullable: true },
  ],
});

export const leadTimelinesTable = defineTable({
  model: 'LeadTimeline',
  table: 'lead_timelines',
  description: 'Lead activity audit trail (tenant via lead)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'action', dbColumn: 'action', type: 'STRING' },
    { name: 'description', dbColumn: 'description', type: 'TEXT', nullable: true },
    { name: 'metadata', dbColumn: 'metadata', type: 'JSON', nullable: true },
    { name: 'leadId', dbColumn: 'lead_id', type: 'UUID', indexed: true, foreignKey: { table: 'leads', column: 'id' } },
    { name: 'performedById', dbColumn: 'performed_by_id', type: 'UUID', foreignKey: { table: 'users', column: 'id' } },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
  ],
});

export const towersTable = defineTable({
  model: 'Tower',
  table: 'towers',
  description: 'Project towers (tenant via project)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'name', dbColumn: 'name', type: 'STRING' },
    { name: 'totalFloors', dbColumn: 'total_floors', type: 'INTEGER' },
    { name: 'description', dbColumn: 'description', type: 'TEXT', nullable: true },
    { name: 'projectId', dbColumn: 'project_id', type: 'UUID', indexed: true, foreignKey: { table: 'projects', column: 'id' } },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
    { name: 'deletedAt', dbColumn: 'deleted_at', type: 'DATETIME', nullable: true },
  ],
});

export const unitsTable = defineTable({
  model: 'Unit',
  table: 'units',
  description: 'Tower units (tenant via tower → project)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'unitNumber', dbColumn: 'unit_number', type: 'STRING' },
    { name: 'floor', dbColumn: 'floor', type: 'INTEGER' },
    { name: 'type', dbColumn: 'type', type: 'ENUM', enumValues: ['STUDIO', 'ONE_BHK', 'TWO_BHK', 'THREE_BHK', 'FOUR_BHK', 'PENTHOUSE', 'VILLA', 'PLOT', 'COMMERCIAL'] },
    { name: 'status', dbColumn: 'status', type: 'ENUM', enumValues: ['AVAILABLE', 'BOOKED', 'SOLD', 'BLOCKED', 'HOLD'], default: 'AVAILABLE', indexed: true },
    { name: 'area', dbColumn: 'area', type: 'DECIMAL' },
    { name: 'price', dbColumn: 'price', type: 'DECIMAL' },
    { name: 'facing', dbColumn: 'facing', type: 'STRING', nullable: true },
    { name: 'description', dbColumn: 'description', type: 'TEXT', nullable: true },
    { name: 'towerId', dbColumn: 'tower_id', type: 'UUID', indexed: true, foreignKey: { table: 'towers', column: 'id' } },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
    { name: 'deletedAt', dbColumn: 'deleted_at', type: 'DATETIME', nullable: true },
  ],
  uniqueConstraints: ['(tower_id, unit_number)'],
});

export const propertyImagesTable = defineTable({
  model: 'PropertyImage',
  table: 'property_images',
  description: 'Property photos (tenant via property)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'url', dbColumn: 'url', type: 'STRING' },
    { name: 'caption', dbColumn: 'caption', type: 'STRING', nullable: true },
    { name: 'isPrimary', dbColumn: 'is_primary', type: 'BOOLEAN', default: 'false' },
    { name: 'sortOrder', dbColumn: 'sort_order', type: 'INTEGER', default: '0' },
    { name: 'propertyId', dbColumn: 'property_id', type: 'UUID', indexed: true, foreignKey: { table: 'properties', column: 'id' } },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
  ],
});

export const siteVisitsTable = defineTable({
  model: 'SiteVisit',
  table: 'site_visits',
  description: 'Scheduled property visits (tenant via lead)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'scheduledAt', dbColumn: 'scheduled_at', type: 'DATETIME', indexed: true },
    { name: 'status', dbColumn: 'status', type: 'ENUM', enumValues: ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'], default: 'SCHEDULED', indexed: true },
    { name: 'feedback', dbColumn: 'feedback', type: 'TEXT', nullable: true },
    { name: 'rating', dbColumn: 'rating', type: 'INTEGER', nullable: true },
    { name: 'notes', dbColumn: 'notes', type: 'TEXT', nullable: true },
    { name: 'completedAt', dbColumn: 'completed_at', type: 'DATETIME', nullable: true },
    { name: 'leadId', dbColumn: 'lead_id', type: 'UUID', indexed: true, foreignKey: { table: 'leads', column: 'id' } },
    { name: 'agentId', dbColumn: 'agent_id', type: 'UUID', indexed: true, foreignKey: { table: 'users', column: 'id' } },
    { name: 'propertyId', dbColumn: 'property_id', type: 'UUID', nullable: true },
    { name: 'projectId', dbColumn: 'project_id', type: 'UUID', nullable: true },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
    { name: 'deletedAt', dbColumn: 'deleted_at', type: 'DATETIME', nullable: true },
  ],
});

export const paymentsTable = defineTable({
  model: 'Payment',
  table: 'payments',
  description: 'Booking payments (tenant via booking)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'amount', dbColumn: 'amount', type: 'DECIMAL' },
    { name: 'method', dbColumn: 'method', type: 'ENUM', enumValues: ['CASH', 'CHEQUE', 'BANK_TRANSFER', 'UPI', 'CARD', 'OTHER'] },
    { name: 'status', dbColumn: 'status', type: 'ENUM', enumValues: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    { name: 'transactionId', dbColumn: 'transaction_id', type: 'STRING', nullable: true },
    { name: 'reference', dbColumn: 'reference', type: 'STRING', nullable: true },
    { name: 'paidAt', dbColumn: 'paid_at', type: 'DATETIME', nullable: true },
    { name: 'notes', dbColumn: 'notes', type: 'TEXT', nullable: true },
    { name: 'bookingId', dbColumn: 'booking_id', type: 'UUID', indexed: true, foreignKey: { table: 'bookings', column: 'id' } },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
  ],
});

export const notificationsTable = defineTable({
  model: 'Notification',
  table: 'notifications',
  description: 'Outbound notifications per organization',
  tenantScoped: true,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'organizationId', dbColumn: 'organization_id', type: 'UUID', indexed: true, tenantKey: true, foreignKey: { table: 'organizations', column: 'id' } },
    { name: 'type', dbColumn: 'type', type: 'ENUM', enumValues: ['EMAIL', 'SMS', 'WHATSAPP'], indexed: true },
    { name: 'status', dbColumn: 'status', type: 'ENUM', enumValues: ['PENDING', 'SENT', 'FAILED', 'DELIVERED'], default: 'PENDING', indexed: true },
    { name: 'recipient', dbColumn: 'recipient', type: 'STRING' },
    { name: 'subject', dbColumn: 'subject', type: 'STRING', nullable: true },
    { name: 'message', dbColumn: 'message', type: 'TEXT' },
    { name: 'metadata', dbColumn: 'metadata', type: 'JSON', nullable: true },
    { name: 'sentAt', dbColumn: 'sent_at', type: 'DATETIME', nullable: true },
    { name: 'error', dbColumn: 'error', type: 'TEXT', nullable: true },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
  ],
});

export const auditLogsTable = defineTable({
  model: 'AuditLog',
  table: 'audit_logs',
  description: 'Change audit trail per organization',
  tenantScoped: true,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'organizationId', dbColumn: 'organization_id', type: 'UUID', indexed: true, tenantKey: true, foreignKey: { table: 'organizations', column: 'id' } },
    { name: 'action', dbColumn: 'action', type: 'STRING' },
    { name: 'entity', dbColumn: 'entity', type: 'STRING' },
    { name: 'entityId', dbColumn: 'entity_id', type: 'STRING' },
    { name: 'oldValues', dbColumn: 'old_values', type: 'JSON', nullable: true },
    { name: 'newValues', dbColumn: 'new_values', type: 'JSON', nullable: true },
    { name: 'ipAddress', dbColumn: 'ip_address', type: 'STRING', nullable: true },
    { name: 'userAgent', dbColumn: 'user_agent', type: 'STRING', nullable: true },
    { name: 'userId', dbColumn: 'user_id', type: 'UUID', nullable: true, indexed: true, foreignKey: { table: 'users', column: 'id' } },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME', indexed: true },
  ],
  indexes: ['organizationId', 'entity+entityId', 'userId', 'createdAt'],
});
