import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { softDeleteFilter, softDeleteData } from '../../common/utils/helpers';

export class ProjectRepository {
  async findBuilderById(id: string) {
    return prisma.builder.findFirst({
      where: { id, ...softDeleteFilter },
      include: { _count: { select: { projects: true } } },
    });
  }

  async findBuilders(skip = 0, take = 10, search?: string) {
    return prisma.builder.findMany({
      where: {
        ...softDeleteFilter,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: { _count: { select: { projects: true } } },
      skip,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async countBuilders(search?: string) {
    return prisma.builder.count({
      where: {
        ...softDeleteFilter,
        ...(search && {
          OR: [{ name: { contains: search, mode: 'insensitive' } }],
        }),
      },
    });
  }

  async createBuilder(data: Prisma.BuilderCreateInput) {
    return prisma.builder.create({ data });
  }

  async updateBuilder(id: string, data: Prisma.BuilderUpdateInput) {
    return prisma.builder.update({ where: { id }, data });
  }

  async softDeleteBuilder(id: string) {
    return prisma.builder.update({ where: { id }, data: softDeleteData() });
  }

  async findProjectById(id: string) {
    return prisma.project.findFirst({
      where: { id, ...softDeleteFilter },
      include: {
        builder: true,
        towers: {
          where: softDeleteFilter,
          include: { _count: { select: { units: true } } },
        },
        _count: { select: { properties: true, leads: true } },
      },
    });
  }

  async findProjects(
    where: Prisma.ProjectWhereInput = {},
    skip = 0,
    take = 10,
    orderBy: Prisma.ProjectOrderByWithRelationInput = { createdAt: 'desc' }
  ) {
    return prisma.project.findMany({
      where: { ...where, ...softDeleteFilter },
      include: {
        builder: { select: { id: true, name: true } },
        _count: { select: { towers: true, properties: true } },
      },
      skip,
      take,
      orderBy,
    });
  }

  async countProjects(where: Prisma.ProjectWhereInput = {}) {
    return prisma.project.count({ where: { ...where, ...softDeleteFilter } });
  }

  async createProject(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({
      data,
      include: { builder: true },
    });
  }

  async updateProject(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data,
      include: { builder: true },
    });
  }

  async softDeleteProject(id: string) {
    return prisma.project.update({ where: { id }, data: softDeleteData() });
  }

  async createTower(data: Prisma.TowerCreateInput) {
    return prisma.tower.create({ data });
  }

  async findTowerById(id: string) {
    return prisma.tower.findFirst({
      where: { id, ...softDeleteFilter },
      include: {
        project: { select: { id: true, name: true } },
        units: { where: softDeleteFilter },
      },
    });
  }

  async createUnit(data: Prisma.UnitCreateInput) {
    return prisma.unit.create({ data });
  }

  async findUnitById(id: string) {
    return prisma.unit.findFirst({
      where: { id, ...softDeleteFilter },
      include: {
        tower: {
          include: { project: { select: { id: true, name: true } } },
        },
      },
    });
  }

  async updateUnit(id: string, data: Prisma.UnitUpdateInput) {
    return prisma.unit.update({ where: { id }, data });
  }

  async findUnitsByTower(towerId: string) {
    return prisma.unit.findMany({
      where: { towerId, ...softDeleteFilter },
      orderBy: [{ floor: 'asc' }, { unitNumber: 'asc' }],
    });
  }
}

export default new ProjectRepository();
