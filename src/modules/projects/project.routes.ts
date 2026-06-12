import { Router } from 'express';
import projectController from './project.controller';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { protect, authorize } from '../../common/middlewares/auth.middleware';
import {
  CreateBuilderDto,
  UpdateBuilderDto,
  CreateProjectDto,
  UpdateProjectDto,
  CreateTowerDto,
  CreateUnitDto,
  UpdateUnitDto,
} from './dto/project.dto';

const router = Router();

router.use(protect);

// Builders
/**
 * @swagger
 * /builders:
 *   get:
 *     tags: [Builders]
 *     summary: List all builders
 *     responses:
 *       200:
 *         description: Paginated builder list
 */
router.get('/builders', authorize('projects.read'), projectController.findAllBuilders.bind(projectController));
router.get('/builders/:id', authorize('projects.read'), projectController.findBuilderById.bind(projectController));
router.post('/builders', authorize('projects.create'), validateDto(CreateBuilderDto), projectController.createBuilder.bind(projectController));
router.put('/builders/:id', authorize('projects.update'), validateDto(UpdateBuilderDto), projectController.updateBuilder.bind(projectController));
router.delete('/builders/:id', authorize('projects.delete'), projectController.deleteBuilder.bind(projectController));

// Projects
/**
 * @swagger
 * /projects:
 *   get:
 *     tags: [Projects]
 *     summary: List all projects
 *     responses:
 *       200:
 *         description: Paginated project list
 */
router.get('/', authorize('projects.read'), projectController.findAllProjects.bind(projectController));
router.get('/:id', authorize('projects.read'), projectController.findProjectById.bind(projectController));
router.post('/', authorize('projects.create'), validateDto(CreateProjectDto), projectController.createProject.bind(projectController));
router.put('/:id', authorize('projects.update'), validateDto(UpdateProjectDto), projectController.updateProject.bind(projectController));
router.delete('/:id', authorize('projects.delete'), projectController.deleteProject.bind(projectController));

// Towers
router.post('/:projectId/towers', authorize('projects.create'), validateDto(CreateTowerDto), projectController.createTower.bind(projectController));
router.get('/towers/:id', authorize('projects.read'), projectController.findTowerById.bind(projectController));

// Units
router.post('/towers/:towerId/units', authorize('projects.create'), validateDto(CreateUnitDto), projectController.createUnit.bind(projectController));
router.get('/towers/:towerId/units', authorize('projects.read'), projectController.findUnitsByTower.bind(projectController));
router.get('/units/:id', authorize('projects.read'), projectController.findUnitById.bind(projectController));
router.put('/units/:id', authorize('projects.update'), validateDto(UpdateUnitDto), projectController.updateUnit.bind(projectController));

export default router;
