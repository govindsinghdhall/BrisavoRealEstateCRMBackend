import { Router } from 'express';
import leadSourceController from './lead-source.controller';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { protect, authorize } from '../../common/middlewares/auth.middleware';
import { CreateLeadSourceDto, UpdateLeadSourceDto } from './dto/lead-source.dto';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /lead-sources:
 *   get:
 *     tags: [Lead Sources]
 *     summary: List all lead sources
 *     responses:
 *       200:
 *         description: Lead source list
 */
router.get('/', authorize('leads.read'), leadSourceController.findAll.bind(leadSourceController));

/**
 * @swagger
 * /lead-sources/{id}:
 *   get:
 *     tags: [Lead Sources]
 *     summary: Get lead source by ID
 *     responses:
 *       200:
 *         description: Lead source details
 */
router.get('/:id', authorize('leads.read'), leadSourceController.findById.bind(leadSourceController));

/**
 * @swagger
 * /lead-sources:
 *   post:
 *     tags: [Lead Sources]
 *     summary: Create lead source
 *     responses:
 *       201:
 *         description: Lead source created
 */
router.post('/', authorize('leads.create'), validateDto(CreateLeadSourceDto), leadSourceController.create.bind(leadSourceController));

/**
 * @swagger
 * /lead-sources/{id}:
 *   put:
 *     tags: [Lead Sources]
 *     summary: Update lead source
 *     responses:
 *       200:
 *         description: Lead source updated
 */
router.put('/:id', authorize('leads.update'), validateDto(UpdateLeadSourceDto), leadSourceController.update.bind(leadSourceController));

/**
 * @swagger
 * /lead-sources/{id}:
 *   delete:
 *     tags: [Lead Sources]
 *     summary: Delete lead source
 *     responses:
 *       204:
 *         description: Lead source deleted
 */
router.delete('/:id', authorize('leads.delete'), leadSourceController.delete.bind(leadSourceController));

export default router;
