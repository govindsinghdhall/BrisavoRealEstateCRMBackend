import { defineTable } from '../types';

export const leadSourcesTable = defineTable({
  model: 'LeadSource',
  table: 'lead_sources',
  description: 'Lead acquisition channels per organization',
  tenantScoped: true,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'organizationId', dbColumn: 'organization_id', type: 'UUID', indexed: true, tenantKey: true, foreignKey: { table: 'organizations', column: 'id' } },
    { name: 'name', dbColumn: 'name', type: 'STRING', description: 'Unique per organization' },
    { name: 'type', dbColumn: 'type', type: 'ENUM', enumValues: ['WEBSITE', 'FACEBOOK', 'GOOGLE', 'WHATSAPP', 'MANUAL_ENTRY', 'REFERRAL', 'WALK_IN', 'OTHER'] },
    { name: 'description', dbColumn: 'description', type: 'TEXT', nullable: true },
    { name: 'isActive', dbColumn: 'is_active', type: 'BOOLEAN', default: 'true' },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
    { name: 'deletedAt', dbColumn: 'deleted_at', type: 'DATETIME', nullable: true },
  ],
  uniqueConstraints: ['(organization_id, name)'],
  relations: ['Organization', 'Lead'],
});
