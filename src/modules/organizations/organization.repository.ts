import { Prisma } from '@prisma/client';
import prisma from '../../config/database';

const select = {
  id: true,
  name: true,
  slug: true,
  logo: true,
  email: true,
  phone: true,
  address: true,
  settings: true,
} as const;

export class OrganizationRepository {
  findById(id: string) {
    return prisma.organization.findFirst({
      where: { id, deletedAt: null },
      select,
    });
  }

  update(
    id: string,
    data: {
      name?: string;
      logo?: string | null;
      email?: string | null;
      phone?: string | null;
      address?: string | null;
      settings?: Prisma.InputJsonValue | typeof Prisma.DbNull;
    },
  ) {
    return prisma.organization.update({
      where: { id },
      data,
      select,
    });
  }
}

export default new OrganizationRepository();
