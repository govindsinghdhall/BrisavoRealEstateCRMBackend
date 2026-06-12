import { defineTable } from '../types';

export const rolePermissionsTable = defineTable({
  model: 'RolePermission',
  table: 'role_permissions',
  description: 'Many-to-many join between roles and permissions',
  tenantScoped: false,
  columns: [
    { name: 'roleId', dbColumn: 'role_id', type: 'UUID', primaryKey: true, foreignKey: { table: 'roles', column: 'id' } },
    { name: 'permissionId', dbColumn: 'permission_id', type: 'UUID', primaryKey: true, foreignKey: { table: 'permissions', column: 'id' } },
  ],
  relations: ['Role', 'Permission'],
});
