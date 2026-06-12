import { Request, Response, NextFunction } from 'express';
import userService from './user.service';
import roleService from './role.service';
import { sendSuccess, sendPaginated, sendCreated, sendNoContent } from '../../common/utils/response.util';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserQueryDto } from './dto/user.dto';
import { getParam } from '../../common/utils/request.util';

export class UserController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.findAll(
        { ...req.query } as PaginationDto & UserQueryDto,
        req.user!.organizationId
      );
      sendPaginated(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.findById(getParam(req, 'id'));
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.create(req.body, req.user!.organizationId);
      sendCreated(res, user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.update(getParam(req, 'id'), req.body);
      sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.delete(getParam(req, 'id'));
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export class RoleController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await roleService.findAll(
        req.query as unknown as PaginationDto,
        req.user!.organizationId
      );
      sendPaginated(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await roleService.findById(getParam(req, 'id'));
      sendSuccess(res, role);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await roleService.create(req.body, req.user!.organizationId);
      sendCreated(res, role);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await roleService.update(getParam(req, 'id'), req.body);
      sendSuccess(res, role, 'Role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await roleService.delete(getParam(req, 'id'));
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async getPermissions(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permissions = await roleService.getAllPermissions();
      sendSuccess(res, permissions);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
export const roleController = new RoleController();
