import { defineTable } from '../types';

export const subscriptionsTable = defineTable({
  model: 'Subscription',
  table: 'subscriptions',
  description: 'Links each organization to a subscription plan',
  tenantScoped: false,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'organizationId', dbColumn: 'organization_id', type: 'UUID', unique: true, foreignKey: { table: 'organizations', column: 'id' }, tenantKey: true },
    { name: 'planId', dbColumn: 'plan_id', type: 'UUID', foreignKey: { table: 'subscription_plans', column: 'id' } },
    { name: 'status', dbColumn: 'status', type: 'ENUM', enumValues: ['TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED'], default: 'TRIAL' },
    { name: 'trialEndsAt', dbColumn: 'trial_ends_at', type: 'DATETIME', nullable: true },
    { name: 'currentPeriodStart', dbColumn: 'current_period_start', type: 'DATETIME' },
    { name: 'currentPeriodEnd', dbColumn: 'current_period_end', type: 'DATETIME' },
    { name: 'cancelledAt', dbColumn: 'cancelled_at', type: 'DATETIME', nullable: true },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
  ],
  indexes: ['organizationId', 'planId', 'status'],
  relations: ['Organization', 'SubscriptionPlan'],
});
