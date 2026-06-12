import { Router } from 'express';
import notificationController from './notification.controller';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { protect, authorize } from '../../common/middlewares/auth.middleware';
import { SendNotificationDto } from './dto/notification.dto';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: List notification history
 *     responses:
 *       200:
 *         description: Notification list
 */
router.get('/', authorize('users.read'), notificationController.findAll.bind(notificationController));

/**
 * @swagger
 * /notifications/send:
 *   post:
 *     tags: [Notifications]
 *     summary: Send notification (Email, SMS, WhatsApp)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, recipient, message]
 *             properties:
 *               type: { type: string, enum: [EMAIL, SMS, WHATSAPP] }
 *               recipient: { type: string }
 *               subject: { type: string }
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Notification queued
 */
router.post('/send', authorize('users.create'), validateDto(SendNotificationDto), notificationController.send.bind(notificationController));

export default router;
