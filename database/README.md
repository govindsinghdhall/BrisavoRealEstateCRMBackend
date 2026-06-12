# Database Schema Documentation

Each table has its own definition file under `database/tables/` describing every column, type, and SaaS tenant scope.

## Folder Structure

```
database/
├── types.ts              # Shared column & table types
├── index.ts              # Registry of all tables + summary helpers
├── README.md
└── tables/
    ├── organizations.table.ts      # SaaS tenant (12 columns)
    ├── subscription-plans.table.ts # Pricing plans (13 columns)
    ├── subscriptions.table.ts        # Org ↔ plan link (10 columns)
    ├── users.table.ts              # Tenant-scoped users (14 columns)
    ├── roles.table.ts              # Per-org roles (8 columns)
    ├── permissions.table.ts        # Global permissions (7 columns)
    ├── leads.table.ts              # Tenant-scoped leads (22 columns)
    ├── properties.table.ts         # Tenant-scoped properties (38 columns)
    ├── bookings.table.ts           # Tenant-scoped bookings (15 columns)
    └── ...
```

## SaaS Architecture

| Layer | Tables | Purpose |
|-------|--------|---------|
| **Tenant** | `organizations`, `subscriptions` | Each customer company |
| **Billing** | `subscription_plans` | Starter / Pro / Enterprise limits |
| **Tenant-scoped** | `users`, `leads`, `properties`, `bookings`, ... | Data isolated by `organization_id` |
| **Global** | `permissions` | Shared across all tenants |
| **Inherited** | `lead_notes`, `payments`, `units`, ... | Scoped via parent FK |

## View Table Details

```bash
# Print summary of all tables
npx tsx -e "import { DATABASE_TABLES, DATABASE_SUMMARY, printTableSummary } from './database'; console.log(DATABASE_SUMMARY); DATABASE_TABLES.forEach(t => console.log(printTableSummary(t), '\n'))"
```

Or import in code:

```typescript
import { getTableByName, printTableSummary } from '../database';

const users = getTableByName('users');
console.log(users?.columnCount); // 14
console.log(printTableSummary(users!));
```

## Adding a New Table

1. Create `database/tables/my-entity.table.ts` using `defineTable()`
2. Add `organizationId` if tenant-scoped (set `tenantScoped: true`)
3. Add model to `prisma/schema.prisma`
4. Register in `database/index.ts`
5. Run `npm run prisma:migrate`
