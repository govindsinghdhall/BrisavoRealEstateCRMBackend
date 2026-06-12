/**
 * Shared types for database table documentation.
 * Each file in `database/tables/` describes one table's columns and SaaS readiness.
 */

export type ColumnType =
  | 'UUID'
  | 'STRING'
  | 'TEXT'
  | 'BOOLEAN'
  | 'INTEGER'
  | 'DECIMAL'
  | 'DATETIME'
  | 'JSON'
  | 'ENUM'
  | 'ARRAY';

export interface TableColumn {
  /** Application-level column name (camelCase) */
  name: string;
  /** PostgreSQL column name (snake_case) */
  dbColumn: string;
  type: ColumnType;
  /** Enum values when type is ENUM */
  enumValues?: string[];
  nullable?: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  indexed?: boolean;
  default?: string;
  foreignKey?: { table: string; column: string };
  /** True if this column participates in tenant (organization) isolation */
  tenantKey?: boolean;
  description?: string;
}

export interface TableDefinition {
  /** Prisma model name */
  model: string;
  /** PostgreSQL table name */
  table: string;
  description: string;
  /** Whether this table is isolated per organization (SaaS tenant) */
  tenantScoped: boolean;
  /** Column count (computed for quick reference) */
  columnCount: number;
  columns: TableColumn[];
  indexes?: string[];
  uniqueConstraints?: string[];
  relations?: string[];
}

export function defineTable(
  def: Omit<TableDefinition, 'columnCount'> & { columns: TableColumn[] }
): TableDefinition {
  return { ...def, columnCount: def.columns.length };
}
