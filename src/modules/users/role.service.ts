import roleRepository from './role.repository';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import {
  PaginationDto,
  buildPaginationMeta,
  getPaginationParams,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import { ConflictError, NotFoundError } from '../../common/errors/app.error';

export class RoleService {
  async findAll(query: PaginationDto, organizationId: string): Promise<PaginatedResult<unknown>> {
    const { page, limit, skip } = getPaginationParams(query);

    const [roles, total] = await Promise.all([
      roleRepository.findMany(organizationId, skip, limit),
      roleRepository.count(organizationId),
    ]);

    return {
      data: roles,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string) {
    const role = await roleRepository.findById(id);
    if (!role) throw new NotFoundError('Role not found');
    return role;
  }

  async create(dto: CreateRoleDto, organizationId: string) {
    const existing = await roleRepository.findByName(dto.name, organizationId);
    if (existing) throw new ConflictError('Role name already exists');

    return roleRepository.create(
      { name: dto.name, description: dto.description, organization: { connect: { id: organizationId } } },
      dto.permissionIds
    );
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await roleRepository.findById(id);
    if (!role) throw new NotFoundError('Role not found');

    if (dto.name && dto.name !== role.name && role.organizationId) {
      const existing = await roleRepository.findByName(dto.name, role.organizationId);
      if (existing) throw new ConflictError('Role name already exists');
    }

    return roleRepository.update(
      id,
      {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
      dto.permissionIds
    );
  }

  async delete(id: string): Promise<void> {
    const role = await roleRepository.findById(id);
    if (!role) throw new NotFoundError('Role not found');
    await roleRepository.softDelete(id);
  }

  async getAllPermissions() {
    return roleRepository.findAllPermissions();
  }
}

export default new RoleService();
