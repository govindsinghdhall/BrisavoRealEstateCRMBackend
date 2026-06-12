import { PrismaClient, LeadSourceType, OrganizationStatus, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Subscription plans (global SaaS catalog)
  const starterPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'starter' },
    update: {},
    create: {
      name: 'Starter',
      slug: 'starter',
      description: 'For small teams getting started',
      priceMonthly: 49,
      priceYearly: 490,
      maxUsers: 5,
      maxLeads: 500,
      maxProperties: 50,
      features: { reports: true, notifications: ['email'] },
    },
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'pro' },
    update: {},
    create: {
      name: 'Pro',
      slug: 'pro',
      description: 'For growing real estate businesses',
      priceMonthly: 149,
      priceYearly: 1490,
      maxUsers: 25,
      maxLeads: 5000,
      maxProperties: 500,
      features: { reports: true, notifications: ['email', 'sms', 'whatsapp'] },
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { slug: 'enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Unlimited scale with custom domain',
      priceMonthly: 499,
      priceYearly: 4990,
      maxUsers: 9999,
      maxLeads: 999999,
      maxProperties: 99999,
      features: { reports: true, customDomain: true, apiAccess: true },
    },
  });

  // Demo organization (tenant)
  const organization = await prisma.organization.upsert({
    where: { slug: 'demo-realty' },
    update: {},
    create: {
      name: 'Demo Realty',
      slug: 'demo-realty',
      email: 'contact@demo-realty.com',
      status: OrganizationStatus.ACTIVE,
    },
  });

  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);

  await prisma.subscription.upsert({
    where: { organizationId: organization.id },
    update: {},
    create: {
      organizationId: organization.id,
      planId: proPlan.id,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: trialEnd,
    },
  });

  // Global permissions
  const permissions = [
    { name: 'users.create', module: 'users', action: 'create', description: 'Create users' },
    { name: 'users.read', module: 'users', action: 'read', description: 'View users' },
    { name: 'users.update', module: 'users', action: 'update', description: 'Update users' },
    { name: 'users.delete', module: 'users', action: 'delete', description: 'Delete users' },
    { name: 'leads.create', module: 'leads', action: 'create', description: 'Create leads' },
    { name: 'leads.read', module: 'leads', action: 'read', description: 'View leads' },
    { name: 'leads.update', module: 'leads', action: 'update', description: 'Update leads' },
    { name: 'leads.delete', module: 'leads', action: 'delete', description: 'Delete leads' },
    { name: 'leads.assign', module: 'leads', action: 'assign', description: 'Assign leads' },
    { name: 'properties.create', module: 'properties', action: 'create', description: 'Create properties' },
    { name: 'properties.read', module: 'properties', action: 'read', description: 'View properties' },
    { name: 'properties.update', module: 'properties', action: 'update', description: 'Update properties' },
    { name: 'properties.delete', module: 'properties', action: 'delete', description: 'Delete properties' },
    { name: 'projects.create', module: 'projects', action: 'create', description: 'Create projects' },
    { name: 'projects.read', module: 'projects', action: 'read', description: 'View projects' },
    { name: 'projects.update', module: 'projects', action: 'update', description: 'Update projects' },
    { name: 'projects.delete', module: 'projects', action: 'delete', description: 'Delete projects' },
    { name: 'bookings.create', module: 'bookings', action: 'create', description: 'Create bookings' },
    { name: 'bookings.read', module: 'bookings', action: 'read', description: 'View bookings' },
    { name: 'bookings.update', module: 'bookings', action: 'update', description: 'Update bookings' },
    { name: 'reports.read', module: 'reports', action: 'read', description: 'View reports' },
    { name: 'roles.manage', module: 'roles', action: 'manage', description: 'Manage roles and permissions' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  const allPermissions = await prisma.permission.findMany();

  // Per-organization roles
  const adminRole = await prisma.role.upsert({
    where: { organizationId_name: { organizationId: organization.id, name: 'Admin' } },
    update: {},
    create: {
      name: 'Admin',
      description: 'Full organization access',
      organizationId: organization.id,
      permissions: {
        create: allPermissions.map((p) => ({ permissionId: p.id })),
      },
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { organizationId_name: { organizationId: organization.id, name: 'Manager' } },
    update: {},
    create: {
      name: 'Manager',
      description: 'Team management and reporting',
      organizationId: organization.id,
      permissions: {
        create: allPermissions
          .filter(
            (p) =>
              !p.name.startsWith('roles.') &&
              !p.name.startsWith('users.delete') &&
              p.name !== 'users.create'
          )
          .map((p) => ({ permissionId: p.id })),
      },
    },
  });

  const agentRole = await prisma.role.upsert({
    where: { organizationId_name: { organizationId: organization.id, name: 'Agent' } },
    update: {},
    create: {
      name: 'Agent',
      description: 'Sales agent with lead management access',
      organizationId: organization.id,
      permissions: {
        create: allPermissions
          .filter((p) =>
            ['leads.', 'properties.read', 'projects.read', 'bookings.'].some((prefix) =>
              p.name.startsWith(prefix)
            )
          )
          .map((p) => ({ permissionId: p.id })),
      },
    },
  });

  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  await prisma.user.upsert({
    where: {
      organizationId_email: {
        organizationId: organization.id,
        email: 'admin@realestatecrm.com',
      },
    },
    update: {},
    create: {
      email: 'admin@realestatecrm.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      phone: '+919999999999',
      organizationId: organization.id,
      roleId: adminRole.id,
    },
  });

  const leadSources = [
    { name: 'Website', type: LeadSourceType.WEBSITE, description: 'Leads from company website' },
    { name: 'Facebook', type: LeadSourceType.FACEBOOK, description: 'Leads from Facebook ads' },
    { name: 'Google', type: LeadSourceType.GOOGLE, description: 'Leads from Google ads' },
    { name: 'WhatsApp', type: LeadSourceType.WHATSAPP, description: 'Leads from WhatsApp inquiries' },
    { name: 'Manual Entry', type: LeadSourceType.MANUAL_ENTRY, description: 'Manually entered leads' },
  ];

  for (const source of leadSources) {
    await prisma.leadSource.upsert({
      where: {
        organizationId_name: { organizationId: organization.id, name: source.name },
      },
      update: {},
      create: { ...source, organizationId: organization.id },
    });
  }

  const { default: propertyLookupService } = await import(
    '../src/modules/property-lookups/property-lookup.service'
  );
  await propertyLookupService.seedDefaultsForOrganization(organization.id);

  console.log('Seed completed successfully');
  console.log('Organization: demo-realty (Demo Realty)');
  console.log('Login: admin@realestatecrm.com / Admin@123');
  console.log('Optional: organizationSlug=demo-realty in login body');
  console.log(`Plans: ${starterPlan.name}, ${proPlan.name}, Enterprise`);
  console.log(`Roles: ${adminRole.name}, ${managerRole.name}, ${agentRole.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
