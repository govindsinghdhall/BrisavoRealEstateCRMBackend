import projectRepository from './project.repository';
import {
  CreateBuilderDto,
  UpdateBuilderDto,
  CreateProjectDto,
  UpdateProjectDto,
  CreateTowerDto,
  CreateUnitDto,
  UpdateUnitDto,
} from './dto/project.dto';
import {
  PaginationDto,
  buildPaginationMeta,
  getPaginationParams,
  buildSearchFilter,
  buildSortOrder,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import { NotFoundError, ConflictError } from '../../common/errors/app.error';

export class ProjectService {
  // Builders
  async findAllBuilders(query: PaginationDto): Promise<PaginatedResult<unknown>> {
    const { page, limit, skip } = getPaginationParams(query);
    const [builders, total] = await Promise.all([
      projectRepository.findBuilders(skip, limit, query.search),
      projectRepository.countBuilders(query.search),
    ]);
    return { data: builders, meta: buildPaginationMeta(total, page, limit) };
  }

  async findBuilderById(id: string) {
    const builder = await projectRepository.findBuilderById(id);
    if (!builder) throw new NotFoundError('Builder not found');
    return builder;
  }

  async createBuilder(dto: CreateBuilderDto, organizationId: string) {
    return projectRepository.createBuilder({
      ...dto,
      organization: { connect: { id: organizationId } },
    });
  }

  async updateBuilder(id: string, dto: UpdateBuilderDto) {
    const builder = await projectRepository.findBuilderById(id);
    if (!builder) throw new NotFoundError('Builder not found');
    return projectRepository.updateBuilder(id, dto);
  }

  async deleteBuilder(id: string): Promise<void> {
    const builder = await projectRepository.findBuilderById(id);
    if (!builder) throw new NotFoundError('Builder not found');
    await projectRepository.softDeleteBuilder(id);
  }

  // Projects
  async findAllProjects(query: PaginationDto): Promise<PaginatedResult<unknown>> {
    const { page, limit, skip } = getPaginationParams(query);
    const where = buildSearchFilter(query.search, ['name', 'city', 'address']);
    const [projects, total] = await Promise.all([
      projectRepository.findProjects(where, skip, limit, buildSortOrder(query.sortBy, query.sortOrder)),
      projectRepository.countProjects(where),
    ]);
    return { data: projects, meta: buildPaginationMeta(total, page, limit) };
  }

  async findProjectById(id: string) {
    const project = await projectRepository.findProjectById(id);
    if (!project) throw new NotFoundError('Project not found');
    return project;
  }

  async createProject(dto: CreateProjectDto, organizationId: string) {
    const builder = await projectRepository.findBuilderById(dto.builderId);
    if (!builder) throw new NotFoundError('Builder not found');

    return projectRepository.createProject({
      organization: { connect: { id: organizationId } },
      name: dto.name,
      description: dto.description,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      pincode: dto.pincode,
      status: dto.status,
      launchDate: dto.launchDate ? new Date(dto.launchDate) : undefined,
      possessionDate: dto.possessionDate ? new Date(dto.possessionDate) : undefined,
      amenities: dto.amenities || [],
      builder: { connect: { id: dto.builderId } },
    });
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    const project = await projectRepository.findProjectById(id);
    if (!project) throw new NotFoundError('Project not found');
    return projectRepository.updateProject(id, dto);
  }

  async deleteProject(id: string): Promise<void> {
    const project = await projectRepository.findProjectById(id);
    if (!project) throw new NotFoundError('Project not found');
    await projectRepository.softDeleteProject(id);
  }

  // Towers
  async createTower(projectId: string, dto: CreateTowerDto) {
    const project = await projectRepository.findProjectById(projectId);
    if (!project) throw new NotFoundError('Project not found');

    return projectRepository.createTower({
      name: dto.name,
      totalFloors: dto.totalFloors,
      description: dto.description,
      project: { connect: { id: projectId } },
    });
  }

  async findTowerById(id: string) {
    const tower = await projectRepository.findTowerById(id);
    if (!tower) throw new NotFoundError('Tower not found');
    return tower;
  }

  // Units
  async createUnit(towerId: string, dto: CreateUnitDto) {
    const tower = await projectRepository.findTowerById(towerId);
    if (!tower) throw new NotFoundError('Tower not found');

    return projectRepository.createUnit({
      unitNumber: dto.unitNumber,
      floor: dto.floor,
      type: dto.type,
      status: dto.status,
      area: dto.area,
      price: dto.price,
      facing: dto.facing,
      tower: { connect: { id: towerId } },
    });
  }

  async findUnitById(id: string) {
    const unit = await projectRepository.findUnitById(id);
    if (!unit) throw new NotFoundError('Unit not found');
    return unit;
  }

  async updateUnit(id: string, dto: UpdateUnitDto) {
    const unit = await projectRepository.findUnitById(id);
    if (!unit) throw new NotFoundError('Unit not found');
    return projectRepository.updateUnit(id, dto);
  }

  async findUnitsByTower(towerId: string) {
    const tower = await projectRepository.findTowerById(towerId);
    if (!tower) throw new NotFoundError('Tower not found');
    return projectRepository.findUnitsByTower(towerId);
  }
}

export default new ProjectService();
