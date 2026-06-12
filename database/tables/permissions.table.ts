import { defineTable } from '../types';

export const permissionsTable = defineTable({
  model: 'Permission',
  table: 'permissions',
  description: 'Global system permissions (shared across all tenants)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'name', dbColumn: 'name', type: 'STRING', unique: true },
    { name: 'module', dbColumn: 'module', type: 'STRING' },
    { name: 'action', dbColumn: 'action', type: 'STRING' },
    { name: 'description', dbColumn: 'description', type: 'TEXT', nullable: true },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
  ],
  uniqueConstraints: ['name', '(module, action)'],
  relations: ['RolePermission'],
});
