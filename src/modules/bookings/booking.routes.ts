import { Router } from 'express';
import bookingController from './booking.controller';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { protect, authorize } from '../../common/middlewares/auth.middleware';
import { CreateBookingDto, UpdateBookingDto, CreatePaymentDto } from './dto/booking.dto';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: List bookings
 *     responses:
 *       200:
 *         description: Paginated booking list
 */
router.get('/', authorize('bookings.read'), bookingController.findAll.bind(bookingController));

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get booking by ID
 *     responses:
 *       200:
 *         description: Booking details with payments
 */
router.get('/:id', authorize('bookings.read'), bookingController.findById.bind(bookingController));

/**
 * @swagger
 * /bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create booking
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post('/', authorize('bookings.create'), validateDto(CreateBookingDto), bookingController.create.bind(bookingController));

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     tags: [Bookings]
 *     summary: Update booking status
 *     responses:
 *       200:
 *         description: Booking updated
 */
router.put('/:id', authorize('bookings.update'), validateDto(UpdateBookingDto), bookingController.update.bind(bookingController));

/**
 * @swagger
 * /bookings/{id}/payments:
 *   post:
 *     tags: [Bookings]
 *     summary: Record payment for booking
 *     responses:
 *       201:
 *         description: Payment recorded
 */
router.post('/:id/payments', authorize('bookings.update'), validateDto(CreatePaymentDto), bookingController.addPayment.bind(bookingController));

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     tags: [Bookings]
 *     summary: Cancel booking
 *     responses:
 *       204:
 *         description: Booking cancelled
 */
router.delete('/:id', authorize('bookings.update'), bookingController.delete.bind(bookingController));

export default router;
