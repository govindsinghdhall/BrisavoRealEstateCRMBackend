import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import propertyController from './property.controller';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { protect, authorize } from '../../common/middlewares/auth.middleware';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
import config from '../../config';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(config.upload.dir, 'properties'));
  },
  filename: (_req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const brochureStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(config.upload.dir, 'brochures'));
  },
  filename: (_req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize, files: 20 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed (JPG, PNG, WebP, GIF, etc.)'));
      return;
    }
    cb(null, true);
  },
});

const uploadBrochure = multer({
  storage: brochureStorage,
  limits: { fileSize: config.upload.maxFileSize * 2 },
  fileFilter: (_req, file, cb) => {
    const allowed = /pdf|doc|docx/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    cb(null, ext);
  },
});

const router = Router();

router.use(protect);

/**
 * @swagger
 * /properties:
 *   get:
 *     tags: [Properties]
 *     summary: List properties with filters
 *     responses:
 *       200:
 *         description: Paginated property list
 */
router.get('/', authorize('properties.read'), propertyController.findAll.bind(propertyController));

/**
 * @swagger
 * /properties/inventory:
 *   get:
 *     tags: [Properties]
 *     summary: Get property inventory summary
 *     responses:
 *       200:
 *         description: Inventory summary by status, type, and city
 */
router.get('/inventory', authorize('properties.read'), propertyController.getInventory.bind(propertyController));

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     tags: [Properties]
 *     summary: Get property by ID
 *     responses:
 *       200:
 *         description: Property details
 */
router.get('/:id', authorize('properties.read'), propertyController.findById.bind(propertyController));

/**
 * @swagger
 * /properties:
 *   post:
 *     tags: [Properties]
 *     summary: Create property
 *     responses:
 *       201:
 *         description: Property created
 */
router.post('/', authorize('properties.create'), validateDto(CreatePropertyDto), propertyController.create.bind(propertyController));

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     tags: [Properties]
 *     summary: Update property
 *     responses:
 *       200:
 *         description: Property updated
 */
router.put('/:id', authorize('properties.update'), validateDto(UpdatePropertyDto), propertyController.update.bind(propertyController));

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     tags: [Properties]
 *     summary: Delete property
 *     responses:
 *       204:
 *         description: Property deleted
 */
router.delete('/:id', authorize('properties.delete'), propertyController.delete.bind(propertyController));

/**
 * @swagger
 * /properties/{id}/images:
 *   post:
 *     tags: [Properties]
 *     summary: Upload property image
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded
 */
router.post('/:id/images', authorize('properties.update'), upload.single('image'), propertyController.uploadImage.bind(propertyController));

router.post(
  '/:id/images/batch',
  authorize('properties.update'),
  upload.array('images', 20),
  propertyController.uploadImages.bind(propertyController)
);

/**
 * @swagger
 * /properties/{id}/brochure:
 *   post:
 *     tags: [Properties]
 *     summary: Upload property brochure
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               brochure:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Brochure uploaded
 */
router.post('/:id/brochure', authorize('properties.update'), uploadBrochure.single('brochure'), propertyController.uploadBrochure.bind(propertyController));

export default router;
