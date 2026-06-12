/**
 * Tenant (organization) scoping utilities for SaaS multi-tenancy.
 * Every tenant-scoped query MUST include organizationId from the authenticated user.
 */

export function tenantScope(organizationId: string): { organizationId: string } {
  return { organizationId };
}

export function withTenant<T extends object>(
  organizationId: string,
  where: T = {} as T
): T & { organizationId: string } {
  return { ...where, organizationId };
}
