import type { TableDefinition } from './types';
import { organizationsTable } from './tables/organizations.table';
import { subscriptionPlansTable } from './tables/subscription-plans.table';
import { subscriptionsTable } from './tables/subscriptions.table';
import { usersTable } from './tables/users.table';
import { rolesTable } from './tables/roles.table';
import { permissionsTable } from './tables/permissions.table';
import { rolePermissionsTable } from './tables/role-permissions.table';
import { leadsTable } from './tables/leads.table';
import { leadSourcesTable } from './tables/lead-sources.table';
import { propertiesTable } from './tables/properties.table';
import { bookingsTable } from './tables/bookings.table';
import { projectsTable } from './tables/projects.table';
import { buildersTable } from './tables/builders.table';
import {
  refreshTokensTable,
  passwordResetsTable,
  leadNotesTable,
  leadTimelinesTable,
  towersTable,
  unitsTable,
  propertyImagesTable,
  siteVisitsTable,
  paymentsTable,
  notificationsTable,
  auditLogsTable,
} from './tables/remaining.tables';

/** Registry of all database tables — one definition file per table/group */
export const DATABASE_TABLES: TableDefinition[] = [
  organizationsTable,
  subscriptionPlansTable,
  subscriptionsTable,
  permissionsTable,
  rolesTable,
  rolePermissionsTable,
  usersTable,
  refreshTokensTable,
  passwordResetsTable,
  leadSourcesTable,
  leadsTable,
  leadNotesTable,
  leadTimelinesTable,
  buildersTable,
  projectsTable,
  towersTable,
  unitsTable,
  propertiesTable,
  propertyImagesTable,
  siteVisitsTable,
  bookingsTable,
  paymentsTable,
  notificationsTable,
  auditLogsTable,
];

export const DATABASE_SUMMARY = {
  totalTables: DATABASE_TABLES.length,
  tenantScopedTables: DATABASE_TABLES.filter((t) => t.tenantScoped).length,
  globalTables: DATABASE_TABLES.filter((t) => !t.tenantScoped).length,
  totalColumns: DATABASE_TABLES.reduce((sum, t) => sum + t.columnCount, 0),
};

export function getTableByName(table: string): TableDefinition | undefined {
  return DATABASE_TABLES.find((t) => t.table === table || t.model === table);
}

export function printTableSummary(table: TableDefinition): string {
  const lines = [
    `Table: ${table.table} (${table.model})`,
    `Columns: ${table.columnCount} | Tenant-scoped: ${table.tenantScoped ? 'Yes' : 'No'}`,
    `Description: ${table.description}`,
    '',
    'Column Name          | DB Column            | Type     | Nullable | Notes',
    '---------------------|----------------------|----------|----------|------',
    ...table.columns.map((c) => {
      const notes = [
        c.primaryKey ? 'PK' : '',
        c.unique ? 'UNIQUE' : '',
        c.indexed ? 'INDEX' : '',
        c.tenantKey ? 'TENANT' : '',
        c.foreignKey ? `FK→${c.foreignKey.table}` : '',
      ]
        .filter(Boolean)
        .join(', ');
      return `${c.name.padEnd(20)} | ${c.dbColumn.padEnd(20)} | ${c.type.padEnd(8)} | ${(c.nullable ? 'YES' : 'NO').padEnd(8)} | ${notes}`;
    }),
  ];
  return lines.join('\n');
}

export * from './types';
