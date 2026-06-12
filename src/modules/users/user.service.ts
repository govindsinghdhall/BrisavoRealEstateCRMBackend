import bcrypt from 'bcryptjs';
import userRepository from './user.repository';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto';
import {
  PaginationDto,
  buildPaginationMeta,
  getPaginationParams,
  buildSearchFilter,
  buildSortOrder,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import { ConflictError, NotFoundError } from '../../common/errors/app.error';

export class UserService {
  async findAll(
    query: PaginationDto & UserQueryDto,
    organizationId: string
  ): Promise<PaginatedResult<unknown>> {
    const { page, limit, skip } = getPaginationParams(query);

    const where = {
      organizationId,
      ...buildSearchFilter(query.search, ['firstName', 'lastName', 'email', 'phone']),
      ...(query.roleId && { roleId: query.roleId }),
      ...(query.isActive !== undefined && { isActive: query.isActive }),
    };

    const [users, total] = await Promise.all([
      userRepository.findMany(where, skip, limit, buildSortOrder(query.sortBy, query.sortOrder)),
      userRepository.count(where),
    ]);

    return {
      data: users.map(this.sanitizeUser),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return this.sanitizeUser(user);
  }

  async create(dto: CreateUserDto, organizationId: string) {
    const existing = await userRepository.findByEmail(dto.email, organizationId);
    if (existing) throw new ConflictError('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      organization: { connect: { id: organizationId } },
      role: { connect: { id: dto.roleId } },
    });

    return this.sanitizeUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');

    if (dto.email && dto.email !== user.email) {
      const existing = await userRepository.findByEmail(dto.email);
      if (existing) throw new ConflictError('Email already in use');
    }

    const updated = await userRepository.update(id, {
      ...(dto.email && { email: dto.email }),
      ...(dto.firstName && { firstName: dto.firstName }),
      ...(dto.lastName && { lastName: dto.lastName }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.roleId && { role: { connect: { id: dto.roleId } } }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    });

    return this.sanitizeUser(updated);
  }

  async delete(id: string): Promise<void> {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    await userRepository.softDelete(id);
  }

  private sanitizeUser(user: Awaited<ReturnType<typeof userRepository.findById>>) {
    if (!user) return null;
    const { password, ...sanitized } = user;
    return {
      ...sanitized,
      permissions: user.role.permissions.map((rp: { permission: { name: string } }) => rp.permission.name),
    };
  }
}

export default new UserService();
