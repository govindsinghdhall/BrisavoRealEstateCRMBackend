import { defineTable } from '../types';

export const usersTable = defineTable({
  model: 'User',
  table: 'users',
  description: 'Users belonging to an organization (tenant-scoped)',
  tenantScoped: true,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'organizationId', dbColumn: 'organization_id', type: 'UUID', indexed: true, tenantKey: true, foreignKey: { table: 'organizations', column: 'id' } },
    { name: 'email', dbColumn: 'email', type: 'STRING', indexed: true, description: 'Unique per organization' },
    { name: 'password', dbColumn: 'password', type: 'STRING' },
    { name: 'firstName', dbColumn: 'first_name', type: 'STRING' },
    { name: 'lastName', dbColumn: 'last_name', type: 'STRING' },
    { name: 'phone', dbColumn: 'phone', type: 'STRING', nullable: true },
    { name: 'avatar', dbColumn: 'avatar', type: 'STRING', nullable: true },
    { name: 'isActive', dbColumn: 'is_active', type: 'BOOLEAN', default: 'true' },
    { name: 'lastLoginAt', dbColumn: 'last_login_at', type: 'DATETIME', nullable: true },
    { name: 'roleId', dbColumn: 'role_id', type: 'UUID', indexed: true, foreignKey: { table: 'roles', column: 'id' } },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
    { name: 'deletedAt', dbColumn: 'deleted_at', type: 'DATETIME', nullable: true },
  ],
  uniqueConstraints: ['(organization_id, email)'],
  indexes: ['organizationId', 'email', 'roleId'],
  relations: ['Organization', 'Role', 'Lead', 'Booking', 'SiteVisit', 'AuditLog'],
});
