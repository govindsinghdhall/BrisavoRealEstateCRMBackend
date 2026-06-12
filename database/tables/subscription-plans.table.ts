import { defineTable } from '../types';

export const subscriptionPlansTable = defineTable({
  model: 'SubscriptionPlan',
  table: 'subscription_plans',
  description: 'Global SaaS pricing plans (Starter, Pro, Enterprise)',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'name', dbColumn: 'name', type: 'STRING', unique: true },
    { name: 'slug', dbColumn: 'slug', type: 'STRING', unique: true },
    { name: 'description', dbColumn: 'description', type: 'TEXT', nullable: true },
    { name: 'priceMonthly', dbColumn: 'price_monthly', type: 'DECIMAL', description: 'Monthly price in USD' },
    { name: 'priceYearly', dbColumn: 'price_yearly', type: 'DECIMAL', nullable: true },
    { name: 'maxUsers', dbColumn: 'max_users', type: 'INTEGER', description: 'User limit per tenant' },
    { name: 'maxLeads', dbColumn: 'max_leads', type: 'INTEGER', description: 'Lead limit per tenant' },
    { name: 'maxProperties', dbColumn: 'max_properties', type: 'INTEGER', description: 'Property limit per tenant' },
    { name: 'features', dbColumn: 'features', type: 'JSON', nullable: true, description: 'Feature flags per plan' },
    { name: 'isActive', dbColumn: 'is_active', type: 'BOOLEAN', default: 'true' },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
  ],
  relations: ['Subscription'],
});
