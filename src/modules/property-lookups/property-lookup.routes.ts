import { Router } from 'express';
import propertyLookupController from './property-lookup.controller';
import { validateDto } from '../../common/middlewares/validate.middleware';
import { protect, authorize } from '../../common/middlewares/auth.middleware';
import { CreatePropertyLookupDto } from './dto/property-lookup.dto';

const router = Router();

router.use(protect);

router.get('/', authorize('properties.read'), propertyLookupController.findAll.bind(propertyLookupController));
router.post('/', authorize('properties.create'), validateDto(CreatePropertyLookupDto), propertyLookupController.create.bind(propertyLookupController));

export default router;
