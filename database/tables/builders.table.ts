import { defineTable } from '../types';

export const buildersTable = defineTable({
  model: 'Builder',
  table: 'builders',
  description: 'Property builders/developers per organization',
  tenantScoped: true,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'organizationId', dbColumn: 'organization_id', type: 'UUID', indexed: true, tenantKey: true, foreignKey: { table: 'organizations', column: 'id' } },
    { name: 'name', dbColumn: 'name', type: 'STRING' },
    { name: 'description', dbColumn: 'description', type: 'TEXT', nullable: true },
    { name: 'logo', dbColumn: 'logo', type: 'STRING', nullable: true },
    { name: 'website', dbColumn: 'website', type: 'STRING', nullable: true },
    { name: 'email', dbColumn: 'email', type: 'STRING', nullable: true },
    { name: 'phone', dbColumn: 'phone', type: 'STRING', nullable: true },
    { name: 'address', dbColumn: 'address', type: 'STRING', nullable: true },
    { name: 'city', dbColumn: 'city', type: 'STRING', nullable: true },
    { name: 'state', dbColumn: 'state', type: 'STRING', nullable: true },
    { name: 'isActive', dbColumn: 'is_active', type: 'BOOLEAN', default: 'true' },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
    { name: 'deletedAt', dbColumn: 'deleted_at', type: 'DATETIME', nullable: true },
  ],
  indexes: ['organizationId'],
  relations: ['Organization', 'Project'],
});
