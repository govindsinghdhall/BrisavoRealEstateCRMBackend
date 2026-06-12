import { PropertyStatus } from '@prisma/client';
import prisma from '../../config/database';
import propertyRepository from '../properties/property.repository';
import leadRepository from '../leads/lead.repository';
import { PublicInquiryDto } from './dto/public.dto';
import {
  PaginationDto,
  buildPaginationMeta,
  getPaginationParams,
  buildSortOrder,
} from '../../common/dto/pagination.dto';
import { NotFoundError } from '../../common/errors/app.error';
import { softDeleteFilter } from '../../common/utils/helpers';
import { buildPublicPropertyWhere, PublicPropertyQuery } from './public.filters';
import { mapToPublicProperty } from './property.mapper';

export class PublicService {
  async getProperties(query: PaginationDto & PublicPropertyQuery) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = buildPublicPropertyWhere(query);

    const [properties, total] = await Promise.all([
      propertyRepository.findMany(where, skip, limit, buildSortOrder(query.sortBy, query.sortOrder)),
      propertyRepository.count(where),
    ]);

    return {
      data: properties.map((p) => mapToPublicProperty(p as Record<string, unknown>)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getPropertyById(id: string) {
    const property = await propertyRepository.findById(id);
    const isPublicStatus =
      property?.status === PropertyStatus.AVAILABLE ||
      property?.status === PropertyStatus.UNDER_OFFER;
    if (!property || !property.isActive || !isPublicStatus) {
      throw new NotFoundError('Property not found');
    }
    return mapToPublicProperty(property as Record<string, unknown>);
  }

  async submitInquiry(dto: PublicInquiryDto) {
    const property = dto.propertyId ? await propertyRepository.findById(dto.propertyId) : null;
    if (dto.propertyId && !property) throw new NotFoundError('Property not found');

    const organizationId = property?.organizationId;
    if (!organizationId) {
      const defaultOrg = await prisma.organization.findFirst({ where: { slug: 'demo-realty' } });
      if (!defaultOrg) throw new NotFoundError('Organization not configured');
    }
    const orgId = organizationId ?? (await prisma.organization.findFirst({ where: { slug: 'demo-realty' } }))!.id;

    const [websiteSource, systemUser] = await Promise.all([
      prisma.leadSource.findFirst({ where: { name: 'Website', organizationId: orgId, ...softDeleteFilter } }),
      prisma.user.findFirst({ where: { email: 'admin@realestatecrm.com', organizationId: orgId, ...softDeleteFilter } }),
    ]);

    if (!websiteSource) throw new NotFoundError('Website lead source not configured');
    if (!systemUser) throw new NotFoundError('System user not configured');

    const lead = await leadRepository.create({
      organization: { connect: { id: orgId } },
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      budget: dto.budget,
      requirements: dto.message,
      city: dto.city,
      source: { connect: { id: websiteSource.id } },
      createdBy: { connect: { id: systemUser.id } },
      ...(dto.propertyId && { property: { connect: { id: dto.propertyId } } }),
    });

    await leadRepository.createTimelineEntry({
      action: 'LEAD_CREATED',
      description: 'Lead submitted via public website',
      lead: { connect: { id: lead.id } },
      performedBy: { connect: { id: systemUser.id } },
    });

    return {
      id: lead.id,
      message: 'Thank you! Our team will contact you shortly.',
    };
  }
}

export default new PublicService();
