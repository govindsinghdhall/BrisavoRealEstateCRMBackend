import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../../config';
import authRepository, { UserWithRole } from './auth.repository';
import {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  ConflictError,
} from '../../common/errors/app.error';
import prisma from '../../config/database';
import { JwtPayload } from '../../common/middlewares/auth.middleware';
import { parseExpiresIn } from '../../common/utils/helpers';
import { notificationQueue } from '../../jobs/queues/notification.queue';

export class AuthService {
  async register(dto: RegisterDto) {
    const organization = await prisma.organization.findFirst({
      where: { slug: 'demo-realty', deletedAt: null },
    });
    if (!organization) {
      throw new NotFoundError('Default organization not found');
    }

    const existing = await authRepository.findByEmail(dto.email, organization.id);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    const agentRole = await prisma.role.findFirst({
      where: { name: 'Agent', organizationId: organization.id },
    });
    if (!agentRole) {
      throw new NotFoundError('Default role not found');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        organization: { connect: { id: organization.id } },
        role: { connect: { id: agentRole.id } },
      },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    const tokens = await this.generateTokens(user);
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    let organizationId: string | undefined;

    if (dto.organizationSlug) {
      const org = await prisma.organization.findFirst({
        where: { slug: dto.organizationSlug, deletedAt: null },
      });
      if (!org) {
        throw new UnauthorizedError('Invalid email or password');
      }
      organizationId = org.id;
    }

    const user = await authRepository.findByEmail(dto.email, organizationId);

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = await this.generateTokens(user);
    await authRepository.updateLastLogin(user.id);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await authRepository.revokeRefreshToken(refreshToken);
  }

  async refreshToken(refreshToken: string) {
    const storedToken = await authRepository.findRefreshToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await authRepository.findByEmail(
      storedToken.user.email,
      storedToken.user.organizationId
    );
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    await authRepository.revokeRefreshToken(refreshToken);
    const tokens = await this.generateTokens(user);

    return tokens;
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await authRepository.updatePassword(userId, hashedPassword);
    await authRepository.revokeAllUserTokens(userId);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await authRepository.findByEmail(dto.email);

    if (!user) {
      return;
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + parseExpiresIn(config.passwordReset.expiresIn));

    await authRepository.createPasswordReset(user.id, token, expiresAt);

    await notificationQueue.add('send-email', {
      to: user.email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      data: { token, name: user.firstName },
    });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const resetRecord = await authRepository.findPasswordReset(dto.token);

    if (!resetRecord) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await authRepository.updatePassword(resetRecord.userId, hashedPassword);
    await authRepository.markPasswordResetUsed(dto.token);
    await authRepository.revokeAllUserTokens(resetRecord.userId);
  }

  private async generateTokens(user: UserWithRole) {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      organizationId: user.organizationId,
    };

    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
    } as SignOptions);

    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + parseExpiresIn(config.jwt.refreshExpiresIn));

    await authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: UserWithRole) {
    const { password, ...sanitized } = user;
    return {
      ...sanitized,
      permissions: user.role.permissions.map((rp) => rp.permission.name),
    };
  }
}

export default new AuthService();
