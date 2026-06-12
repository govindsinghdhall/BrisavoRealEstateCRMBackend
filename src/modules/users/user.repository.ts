import { Prisma, User } from '@prisma/client';
import prisma from '../../config/database';
import { softDeleteFilter, softDeleteData } from '../../common/utils/helpers';

const userInclude = {
  role: {
    include: {
      permissions: { include: { permission: true } },
    },
  },
};

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id, ...softDeleteFilter },
      include: userInclude,
    });
  }

  async findByEmail(email: string, organizationId?: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        ...softDeleteFilter,
        ...(organizationId && { organizationId }),
      },
    });
  }

  async findMany(
    where: Prisma.UserWhereInput = {},
    skip = 0,
    take = 10,
    orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: 'desc' }
  ) {
    return prisma.user.findMany({
      where: { ...where, ...softDeleteFilter },
      include: userInclude,
      skip,
      take,
      orderBy,
    });
  }

  async count(where: Prisma.UserWhereInput = {}): Promise<number> {
    return prisma.user.count({
      where: { ...where, ...softDeleteFilter },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      include: userInclude,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      include: userInclude,
    });
  }

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: softDeleteData(),
    });
  }
}

export default new UserRepository();
