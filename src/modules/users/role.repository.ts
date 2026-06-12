import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { softDeleteFilter, softDeleteData } from '../../common/utils/helpers';

export class RoleRepository {
  async findById(id: string) {
    return prisma.role.findFirst({
      where: { id, ...softDeleteFilter },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
  }

  async findByName(name: string, organizationId?: string) {
    return prisma.role.findFirst({
      where: {
        name,
        ...softDeleteFilter,
        ...(organizationId !== undefined && { organizationId }),
      },
    });
  }

  async findMany(organizationId: string, skip = 0, take = 10) {
    return prisma.role.findMany({
      where: { ...softDeleteFilter, organizationId },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
      skip,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async count(organizationId: string): Promise<number> {
    return prisma.role.count({ where: { ...softDeleteFilter, organizationId } });
  }

  async create(data: Prisma.RoleCreateInput, permissionIds?: string[]) {
    return prisma.role.create({
      data: {
        ...data,
        ...(permissionIds && {
          permissions: {
            create: permissionIds.map((permissionId) => ({ permissionId })),
          },
        }),
      },
      include: {
        permissions: { include: { permission: true } },
      },
    });
  }

  async update(id: string, data: Prisma.RoleUpdateInput, permissionIds?: string[]) {
    if (permissionIds) {
      await prisma.rolePermission.deleteMany({ where: { roleId: id } });
    }

    return prisma.role.update({
      where: { id },
      data: {
        ...data,
        ...(permissionIds && {
          permissions: {
            create: permissionIds.map((permissionId) => ({ permissionId })),
          },
        }),
      },
      include: {
        permissions: { include: { permission: true } },
      },
    });
  }

  async softDelete(id: string) {
    return prisma.role.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  async findAllPermissions() {
    return prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { action: 'asc' }] });
  }
}

export default new RoleRepository();
