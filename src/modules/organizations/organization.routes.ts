import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import organizationController from './organization.controller';
import { protect, authorize } from '../../common/middlewares/auth.middleware';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { UpdateOrganizationDto } from './dto/organization.dto';
import config from '../../config';

const brandingStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(config.upload.dir, 'organizations'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${uuidv4()}${ext}`);
  },
});

const brandingUpload = multer({
  storage: brandingStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.use(protect);

router.get('/current', organizationController.getCurrent.bind(organizationController));
router.patch(
  '/current',
  authorize('users.update'),
  validateDto(UpdateOrganizationDto),
  organizationController.updateCurrent.bind(organizationController),
);
router.post(
  '/current/logo',
  authorize('users.update'),
  brandingUpload.single('logo'),
  organizationController.uploadLogo.bind(organizationController),
);
router.post(
  '/current/favicon',
  authorize('users.update'),
  brandingUpload.single('favicon'),
  organizationController.uploadFavicon.bind(organizationController),
);

export default router;
