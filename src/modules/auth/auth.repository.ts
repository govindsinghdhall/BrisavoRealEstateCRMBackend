import { Prisma, User } from '@prisma/client';
import prisma from '../../config/database';
import { softDeleteFilter, softDeleteData } from '../../common/utils/helpers';

export type UserWithRole = Prisma.UserGetPayload<{
  include: { role: { include: { permissions: { include: { permission: true } } } } };
}>;

export class AuthRepository {
  async findByEmail(email: string, organizationId?: string): Promise<UserWithRole | null> {
    return prisma.user.findFirst({
      where: {
        email,
        ...softDeleteFilter,
        ...(organizationId && { organizationId }),
      },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { id, ...softDeleteFilter },
    });
  }

  async updatePassword(userId: string, password: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findFirst({
      where: { token, isRevoked: false, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async createPasswordReset(userId: string, token: string, expiresAt: Date) {
    return prisma.passwordReset.create({
      data: { userId, token, expiresAt },
    });
  }

  async findPasswordReset(token: string) {
    return prisma.passwordReset.findFirst({
      where: { token, isUsed: false, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
  }

  async markPasswordResetUsed(token: string): Promise<void> {
    await prisma.passwordReset.updateMany({
      where: { token },
      data: { isUsed: true },
    });
  }
}

export default new AuthRepository();
