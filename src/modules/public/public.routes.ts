import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import publicController from './public.controller';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { websiteApiKey } from '../../common/middlewares/website-api-key.middleware';
import { PublicInquiryDto } from './dto/public.dto';

const router = Router();

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many inquiries. Please try again later.' },
});

router.get('/properties', publicController.getProperties.bind(publicController));
router.get('/properties/:id', publicController.getPropertyById.bind(publicController));
router.post(
  '/inquiries',
  inquiryLimiter,
  websiteApiKey,
  validateDto(PublicInquiryDto),
  publicController.submitInquiry.bind(publicController)
);

export default router;
