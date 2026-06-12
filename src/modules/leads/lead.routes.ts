import { Router } from 'express';
import leadController from './lead.controller';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { protect, authorize } from '../../common/middlewares/auth.middleware';
import { CreateLeadDto, UpdateLeadDto, AssignLeadDto, CreateLeadNoteDto } from './dto/lead.dto';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /leads:
 *   get:
 *     tags: [Leads]
 *     summary: List all leads with pagination, search, and filters
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
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [NEW, CONTACTED, QUALIFIED, NEGOTIATION, BOOKED, LOST, WON] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [LOW, MEDIUM, HIGH, URGENT] }
 *     responses:
 *       200:
 *         description: Paginated lead list
 */
router.get('/', authorize('leads.read'), leadController.findAll.bind(leadController));

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     tags: [Leads]
 *     summary: Get lead by ID with notes and timeline
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Lead details
 */
router.get('/:id', authorize('leads.read'), leadController.findById.bind(leadController));

/**
 * @swagger
 * /leads:
 *   post:
 *     tags: [Leads]
 *     summary: Create a new lead
 *     responses:
 *       201:
 *         description: Lead created
 */
router.post('/', authorize('leads.create'), validateDto(CreateLeadDto), leadController.create.bind(leadController));

/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     tags: [Leads]
 *     summary: Update lead
 *     responses:
 *       200:
 *         description: Lead updated
 */
router.put('/:id', authorize('leads.update'), validateDto(UpdateLeadDto), leadController.update.bind(leadController));

/**
 * @swagger
 * /leads/{id}/assign:
 *   patch:
 *     tags: [Leads]
 *     summary: Assign lead to agent
 *     responses:
 *       200:
 *         description: Lead assigned
 */
router.patch('/:id/assign', authorize('leads.assign'), validateDto(AssignLeadDto), leadController.assign.bind(leadController));

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     tags: [Leads]
 *     summary: Delete lead (soft delete)
 *     responses:
 *       204:
 *         description: Lead deleted
 */
router.delete('/:id', authorize('leads.delete'), leadController.delete.bind(leadController));

/**
 * @swagger
 * /leads/{id}/notes:
 *   post:
 *     tags: [Leads]
 *     summary: Add note to lead
 *     responses:
 *       201:
 *         description: Note added
 */
router.post('/:id/notes', authorize('leads.update'), validateDto(CreateLeadNoteDto), leadController.addNote.bind(leadController));

/**
 * @swagger
 * /leads/{id}/timeline:
 *   get:
 *     tags: [Leads]
 *     summary: Get lead activity timeline
 *     responses:
 *       200:
 *         description: Lead timeline
 */
router.get('/:id/timeline', authorize('leads.read'), leadController.getTimeline.bind(leadController));

export default router;
