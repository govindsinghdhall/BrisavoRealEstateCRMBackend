import { Request, Response, NextFunction } from 'express';
import projectService from './project.service';
import { sendSuccess, sendPaginated, sendCreated, sendNoContent } from '../../common/utils/response.util';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { getParam } from '../../common/utils/request.util';

export class ProjectController {
  async findAllBuilders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await projectService.findAllBuilders(req.query as unknown as PaginationDto);
      sendPaginated(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findBuilderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const builder = await projectService.findBuilderById(getParam(req, 'id'));
      sendSuccess(res, builder);
    } catch (error) {
      next(error);
    }
  }

  async createBuilder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const builder = await projectService.createBuilder(req.body, req.user!.organizationId);
      sendCreated(res, builder);
    } catch (error) {
      next(error);
    }
  }

  async updateBuilder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const builder = await projectService.updateBuilder(getParam(req, 'id'), req.body);
      sendSuccess(res, builder);
    } catch (error) {
      next(error);
    }
  }

  async deleteBuilder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await projectService.deleteBuilder(getParam(req, 'id'));
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async findAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await projectService.findAllProjects(req.query as unknown as PaginationDto);
      sendPaginated(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.findProjectById(getParam(req, 'id'));
      sendSuccess(res, project);
    } catch (error) {
      next(error);
    }
  }

  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.createProject(req.body, req.user!.organizationId);
      sendCreated(res, project);
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.updateProject(getParam(req, 'id'), req.body);
      sendSuccess(res, project);
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await projectService.deleteProject(getParam(req, 'id'));
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async createTower(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tower = await projectService.createTower(getParam(req, 'projectId'), req.body);
      sendCreated(res, tower);
    } catch (error) {
      next(error);
    }
  }

  async findTowerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tower = await projectService.findTowerById(getParam(req, 'id'));
      sendSuccess(res, tower);
    } catch (error) {
      next(error);
    }
  }

  async createUnit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const unit = await projectService.createUnit(getParam(req, 'towerId'), req.body);
      sendCreated(res, unit);
    } catch (error) {
      next(error);
    }
  }

  async findUnitById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const unit = await projectService.findUnitById(getParam(req, 'id'));
      sendSuccess(res, unit);
    } catch (error) {
      next(error);
    }
  }

  async updateUnit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const unit = await projectService.updateUnit(getParam(req, 'id'), req.body);
      sendSuccess(res, unit);
    } catch (error) {
      next(error);
    }
  }

  async findUnitsByTower(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const units = await projectService.findUnitsByTower(getParam(req, 'towerId'));
      sendSuccess(res, units);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
