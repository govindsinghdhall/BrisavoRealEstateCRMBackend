import { Router } from 'express';
import reportController from './report.controller';
import { protect, authorize } from '../../common/middlewares/auth.middleware';

const router = Router();

router.use(protect);
router.use(authorize('reports.read'));

/**
 * @swagger
 * /reports/lead-conversion:
 *   get:
 *     tags: [Reports]
 *     summary: Lead conversion report
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Lead conversion analytics
 */
router.get('/lead-conversion', reportController.leadConversion.bind(reportController));

/**
 * @swagger
 * /reports/sales:
 *   get:
 *     tags: [Reports]
 *     summary: Sales report
 *     responses:
 *       200:
 *         description: Sales analytics
 */
router.get('/sales', reportController.salesReport.bind(reportController));

/**
 * @swagger
 * /reports/revenue:
 *   get:
 *     tags: [Reports]
 *     summary: Revenue report
 *     responses:
 *       200:
 *         description: Revenue analytics
 */
router.get('/revenue', reportController.revenueReport.bind(reportController));

/**
 * @swagger
 * /reports/agent-performance:
 *   get:
 *     tags: [Reports]
 *     summary: Agent performance report
 *     responses:
 *       200:
 *         description: Agent performance metrics
 */
router.get('/agent-performance', reportController.agentPerformance.bind(reportController));

export default router;
