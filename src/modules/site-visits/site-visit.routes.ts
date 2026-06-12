import { Router } from 'express';
import siteVisitController from './site-visit.controller';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { protect, authorize } from '../../common/middlewares/auth.middleware';
import { CreateSiteVisitDto, UpdateSiteVisitDto, VisitFeedbackDto } from './dto/site-visit.dto';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /site-visits:
 *   get:
 *     tags: [Site Visits]
 *     summary: List site visits
 *     responses:
 *       200:
 *         description: Paginated site visit list
 */
router.get('/', authorize('leads.read'), siteVisitController.findAll.bind(siteVisitController));

/**
 * @swagger
 * /site-visits/{id}:
 *   get:
 *     tags: [Site Visits]
 *     summary: Get site visit by ID
 *     responses:
 *       200:
 *         description: Site visit details
 */
router.get('/:id', authorize('leads.read'), siteVisitController.findById.bind(siteVisitController));

/**
 * @swagger
 * /site-visits:
 *   post:
 *     tags: [Site Visits]
 *     summary: Schedule a site visit
 *     responses:
 *       201:
 *         description: Site visit scheduled
 */
router.post('/', authorize('leads.create'), validateDto(CreateSiteVisitDto), siteVisitController.create.bind(siteVisitController));

/**
 * @swagger
 * /site-visits/{id}:
 *   put:
 *     tags: [Site Visits]
 *     summary: Update site visit
 *     responses:
 *       200:
 *         description: Site visit updated
 */
router.put('/:id', authorize('leads.update'), validateDto(UpdateSiteVisitDto), siteVisitController.update.bind(siteVisitController));

/**
 * @swagger
 * /site-visits/{id}/feedback:
 *   post:
 *     tags: [Site Visits]
 *     summary: Submit visit feedback
 *     responses:
 *       200:
 *         description: Feedback submitted
 */
router.post('/:id/feedback', authorize('leads.update'), validateDto(VisitFeedbackDto), siteVisitController.submitFeedback.bind(siteVisitController));

/**
 * @swagger
 * /site-visits/{id}:
 *   delete:
 *     tags: [Site Visits]
 *     summary: Cancel site visit
 *     responses:
 *       204:
 *         description: Site visit deleted
 */
router.delete('/:id', authorize('leads.delete'), siteVisitController.delete.bind(siteVisitController));

export default router;
