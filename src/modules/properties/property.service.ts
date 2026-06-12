import propertyRepository from './property.repository';
import propertyLookupService from '../property-lookups/property-lookup.service';
import { CreatePropertyDto, UpdatePropertyDto, PropertyQueryDto } from './dto/property.dto';
import {
  PaginationDto,
  buildPaginationMeta,
  getPaginationParams,
  buildSearchFilter,
  buildSortOrder,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import { NotFoundError } from '../../common/errors/app.error';

function propertyDataFromDto(dto: CreatePropertyDto | UpdatePropertyDto) {
  return {
    ...(dto.title !== undefined && { title: dto.title }),
    ...(dto.description !== undefined && { description: dto.description }),
    ...(dto.listingCategory !== undefined && { listingCategory: dto.listingCategory }),
    ...(dto.type !== undefined && { type: dto.type }),
    ...(dto.status !== undefined && { status: dto.status }),
    ...(dto.price !== undefined && { price: dto.price }),
    ...(dto.area !== undefined && { area: dto.area }),
    ...(dto.carpetArea !== undefined && { carpetArea: dto.carpetArea }),
    ...(dto.builtUpArea !== undefined && { builtUpArea: dto.builtUpArea }),
    ...(dto.superArea !== undefined && { superArea: dto.superArea }),
    ...(dto.bedrooms !== undefined && { bedrooms: dto.bedrooms }),
    ...(dto.bathrooms !== undefined && { bathrooms: dto.bathrooms }),
    ...(dto.address !== undefined && { address: dto.address }),
    ...(dto.city !== undefined && { city: dto.city }),
    ...(dto.state !== undefined && { state: dto.state }),
    ...(dto.pincode !== undefined && { pincode: dto.pincode }),
    ...(dto.locality !== undefined && { locality: dto.locality }),
    ...(dto.sector !== undefined && { sector: dto.sector }),
    ...(dto.landmark !== undefined && { landmark: dto.landmark }),
    ...(dto.latitude !== undefined && { latitude: dto.latitude }),
    ...(dto.longitude !== undefined && { longitude: dto.longitude }),
    ...(dto.builderName !== undefined && { builderName: dto.builderName }),
    ...(dto.propertyAge !== undefined && { propertyAge: dto.propertyAge }),
    ...(dto.furnishing !== undefined && { furnishing: dto.furnishing }),
    ...(dto.facing !== undefined && { facing: dto.facing }),
    ...(dto.possessionStatus !== undefined && { possessionStatus: dto.possessionStatus }),
    ...(dto.possessionDate !== undefined && { possessionDate: dto.possessionDate || null }),
    ...(dto.roiPotential !== undefined && { roiPotential: dto.roiPotential }),
    ...(dto.isVerified !== undefined && { isVerified: dto.isVerified }),
    ...(dto.hasRera !== undefined && { hasRera: dto.hasRera }),
    ...(dto.reraId !== undefined && { reraId: dto.reraId }),
    ...(dto.videoTourUrl !== undefined && { videoTourUrl: dto.videoTourUrl }),
    ...(dto.virtualTourUrl !== undefined && { virtualTourUrl: dto.virtualTourUrl }),
    ...(dto.brochureUrl !== undefined && { brochureUrl: dto.brochureUrl }),
    ...(dto.amenities !== undefined && { amenities: dto.amenities }),
    ...(dto.isActive !== undefined && { isActive: dto.isActive }),
  };
}

export class PropertyService {
  async findAll(query: PaginationDto & PropertyQueryDto): Promise<PaginatedResult<unknown>> {
    const { page, limit, skip } = getPaginationParams(query);

    const where = {
      ...buildSearchFilter(query.search, [
        'title',
        'address',
        'city',
        'locality',
        'sector',
        'landmark',
        'description',
        'builderName',
      ]),
      ...(query.type && { type: query.type }),
      ...(query.status && { status: query.status }),
      ...(query.listingCategory && { listingCategory: query.listingCategory }),
      ...(query.city && { city: { equals: query.city, mode: 'insensitive' as const } }),
      ...(query.locality && { locality: { contains: query.locality, mode: 'insensitive' as const } }),
      ...(query.minPrice && { price: { gte: query.minPrice } }),
      ...(query.maxPrice && {
        price: {
          ...(query.minPrice ? { gte: query.minPrice } : {}),
          lte: query.maxPrice,
        },
      }),
    };

    const [properties, total] = await Promise.all([
      propertyRepository.findMany(where, skip, limit, buildSortOrder(query.sortBy, query.sortOrder)),
      propertyRepository.count(where),
    ]);

    return { data: properties, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new NotFoundError('Property not found');
    return property;
  }

  async create(dto: CreatePropertyDto, organizationId: string) {
    return propertyRepository.create({
      organization: { connect: { id: organizationId } },
      ...propertyDataFromDto(dto),
      title: dto.title,
      listingCategory: dto.listingCategory,
      type: dto.type,
      price: dto.price,
      area: dto.area,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      locality: dto.locality,
      amenities: dto.amenities || [],
      superArea: dto.superArea ?? dto.area,
      status: dto.status,
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.projectId && { project: { connect: { id: dto.projectId } } }),
    });
  }

  async update(id: string, dto: UpdatePropertyDto) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new NotFoundError('Property not found');

    await propertyLookupService.ensureFromProperty(property.organizationId, {
      locality: dto.locality ?? property.locality,
      sector: dto.sector ?? property.sector,
      landmark: dto.landmark ?? property.landmark,
      pincode: dto.pincode ?? property.pincode,
      builderName: dto.builderName ?? property.builderName,
    });

    return propertyRepository.update(id, {
      ...propertyDataFromDto(dto),
      ...(dto.projectId !== undefined && {
        project: dto.projectId ? { connect: { id: dto.projectId } } : { disconnect: true },
      }),
    });
  }

  async delete(id: string): Promise<void> {
    const property = await propertyRepository.findById(id);
    if (!property) throw new NotFoundError('Property not found');
    await propertyRepository.softDelete(id);
  }

  async uploadImage(id: string, filename: string, caption?: string, isPrimary = false) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new NotFoundError('Property not found');

    const url = `/uploads/properties/${filename}`;
    return propertyRepository.addImage(id, url, caption, isPrimary);
  }

  async uploadImages(id: string, filenames: string[], forcePrimary = false) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new NotFoundError('Property not found');

    const hasPrimary = property.images.some((image) => image.isPrimary);
    const shouldSetPrimary = forcePrimary || !hasPrimary;

    const images = [];
    for (let i = 0; i < filenames.length; i += 1) {
      const image = await propertyRepository.addImage(
        id,
        `/uploads/properties/${filenames[i]}`,
        undefined,
        shouldSetPrimary && i === 0
      );
      images.push(image);
    }

    return images;
  }

  async uploadBrochure(id: string, filename: string) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new NotFoundError('Property not found');

    const brochureUrl = `/uploads/brochures/${filename}`;
    return propertyRepository.updateBrochure(id, brochureUrl);
  }

  async getInventory() {
    return propertyRepository.getInventory();
  }
}

export default new PropertyService();
