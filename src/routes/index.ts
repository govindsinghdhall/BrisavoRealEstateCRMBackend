import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes, { roleRouter } from '../modules/users/user.routes';
import leadRoutes from '../modules/leads/lead.routes';
import propertyRoutes from '../modules/properties/property.routes';
import propertyLookupRoutes from '../modules/property-lookups/property-lookup.routes';
import projectRoutes from '../modules/projects/project.routes';
import siteVisitRoutes from '../modules/site-visits/site-visit.routes';
import bookingRoutes from '../modules/bookings/booking.routes';
import leadSourceRoutes from '../modules/lead-sources/lead-source.routes';
import notificationRoutes from '../modules/notifications/notification.routes';
import reportRoutes from '../modules/reports/report.routes';
import organizationRoutes from '../modules/organizations/organization.routes';
import publicRoutes from '../modules/public/public.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

router.use('/public', publicRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRouter);
router.use('/leads', leadRoutes);
router.use('/properties', propertyRoutes);
router.use('/property-lookups', propertyLookupRoutes);
router.use('/projects', projectRoutes);
router.use('/site-visits', siteVisitRoutes);
router.use('/bookings', bookingRoutes);
router.use('/lead-sources', leadSourceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/organizations', organizationRoutes);

export default router;
