import { defineTable } from '../types';

export const organizationsTable = defineTable({
  model: 'Organization',
  table: 'organizations',
  description: 'SaaS tenant — each real estate company using the platform',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true, description: 'Tenant ID' },
    { name: 'name', dbColumn: 'name', type: 'STRING', description: 'Company display name' },
    { name: 'slug', dbColumn: 'slug', type: 'STRING', unique: true, indexed: true, description: 'URL-safe identifier (acme-realty)' },
    { name: 'domain', dbColumn: 'domain', type: 'STRING', nullable: true, unique: true, description: 'Custom domain for white-label SaaS' },
    { name: 'logo', dbColumn: 'logo', type: 'STRING', nullable: true },
    { name: 'email', dbColumn: 'email', type: 'STRING', nullable: true },
    { name: 'phone', dbColumn: 'phone', type: 'STRING', nullable: true },
    { name: 'address', dbColumn: 'address', type: 'TEXT', nullable: true },
    { name: 'status', dbColumn: 'status', type: 'ENUM', enumValues: ['ACTIVE', 'TRIAL', 'SUSPENDED', 'CANCELLED'], default: 'TRIAL' },
    { name: 'settings', dbColumn: 'settings', type: 'JSON', nullable: true, description: 'Tenant-specific config (branding, locale)' },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
    { name: 'deletedAt', dbColumn: 'deleted_at', type: 'DATETIME', nullable: true },
  ],
  indexes: ['slug', 'status'],
  relations: ['Subscription', 'User', 'Role', 'Lead', 'Property', 'Builder', 'Booking'],
});
