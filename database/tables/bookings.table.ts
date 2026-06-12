import { defineTable } from '../types';

export const bookingsTable = defineTable({
  model: 'Booking',
  table: 'bookings',
  description: 'Property/unit bookings scoped to an organization',
  tenantScoped: true,
  columns: [
    { name: 'id', dbColumn: 'id', type: 'UUID', primaryKey: true },
    { name: 'organizationId', dbColumn: 'organization_id', type: 'UUID', indexed: true, tenantKey: true, foreignKey: { table: 'organizations', column: 'id' } },
    { name: 'bookingNumber', dbColumn: 'booking_number', type: 'STRING', description: 'Unique per organization' },
    { name: 'status', dbColumn: 'status', type: 'ENUM', enumValues: ['PENDING', 'CONFIRMED', 'PARTIALLY_PAID', 'FULLY_PAID', 'CANCELLED', 'REFUNDED'], default: 'PENDING', indexed: true },
    { name: 'totalAmount', dbColumn: 'total_amount', type: 'DECIMAL' },
    { name: 'paidAmount', dbColumn: 'paid_amount', type: 'DECIMAL', default: '0' },
    { name: 'bookingDate', dbColumn: 'booking_date', type: 'DATETIME' },
    { name: 'notes', dbColumn: 'notes', type: 'TEXT', nullable: true },
    { name: 'leadId', dbColumn: 'lead_id', type: 'UUID', indexed: true, foreignKey: { table: 'leads', column: 'id' } },
    { name: 'propertyId', dbColumn: 'property_id', type: 'UUID', nullable: true, foreignKey: { table: 'properties', column: 'id' } },
    { name: 'unitId', dbColumn: 'unit_id', type: 'UUID', nullable: true, foreignKey: { table: 'units', column: 'id' } },
    { name: 'agentId', dbColumn: 'agent_id', type: 'UUID', foreignKey: { table: 'users', column: 'id' } },
    { name: 'createdAt', dbColumn: 'created_at', type: 'DATETIME' },
    { name: 'updatedAt', dbColumn: 'updated_at', type: 'DATETIME' },
    { name: 'deletedAt', dbColumn: 'deleted_at', type: 'DATETIME', nullable: true },
  ],
  uniqueConstraints: ['(organization_id, booking_number)'],
  indexes: ['organizationId', 'leadId', 'status', 'bookingNumber'],
  relations: ['Organization', 'Lead', 'Property', 'Unit', 'User', 'Payment'],
});
