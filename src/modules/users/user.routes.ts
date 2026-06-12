import { Router } from 'express';
import { userController, roleController } from './user.controller';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { protect, authorize, authorizeAdmin, authenticate } from '../../common/middlewares/auth.middleware';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List all users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated user list
 */
router.get('/', authorize('users.read'), userController.findAll.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/:id', authorize('users.read'), userController.findById.bind(userController));

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName, roleId]
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/', authorizeAdmin, validateDto(CreateUserDto), userController.create.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', authorize('users.update'), validateDto(UpdateUserDto), userController.update.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: User deleted
 */
router.delete('/:id', authorize('users.delete'), userController.delete.bind(userController));

export default router;

const roleRouter = Router();

roleRouter.use(authenticate);

/**
 * @swagger
 * /roles:
 *   get:
 *     tags: [Roles]
 *     summary: List all roles
 *     responses:
 *       200:
 *         description: Paginated role list
 */
roleRouter.get(
  '/',
  authorize('roles.manage', 'users.read', 'users.create', 'users.update'),
  roleController.findAll.bind(roleController),
);

/**
 * @swagger
 * /roles/permissions:
 *   get:
 *     tags: [Roles]
 *     summary: List all permissions
 *     responses:
 *       200:
 *         description: Permission list
 */
roleRouter.get('/permissions', authorize('roles.manage'), roleController.getPermissions.bind(roleController));

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: Get role by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Role details
 */
roleRouter.get('/:id', authorize('roles.manage'), roleController.findById.bind(roleController));

/**
 * @swagger
 * /roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     responses:
 *       201:
 *         description: Role created
 */
roleRouter.post('/', authorize('roles.manage'), validateDto(CreateRoleDto), roleController.create.bind(roleController));

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     tags: [Roles]
 *     summary: Update role
 *     responses:
 *       200:
 *         description: Role updated
 */
roleRouter.put('/:id', authorize('roles.manage'), validateDto(UpdateRoleDto), roleController.update.bind(roleController));

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete role
 *     responses:
 *       204:
 *         description: Role deleted
 */
roleRouter.delete('/:id', authorize('roles.manage'), roleController.delete.bind(roleController));

export { roleRouter };
