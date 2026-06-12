import siteVisitRepository from './site-visit.repository';
import { CreateSiteVisitDto, UpdateSiteVisitDto, VisitFeedbackDto, SiteVisitQueryDto } from './dto/site-visit.dto';
import {
  PaginationDto,
  buildPaginationMeta,
  getPaginationParams,
  buildSortOrder,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import { NotFoundError } from '../../common/errors/app.error';
import { VisitStatus } from '@prisma/client';
import leadRepository from '../leads/lead.repository';

export class SiteVisitService {
  async findAll(query: PaginationDto & SiteVisitQueryDto): Promise<PaginatedResult<unknown>> {
    const { page, limit, skip } = getPaginationParams(query);

    const where = {
      ...(query.status && { status: query.status }),
      ...(query.agentId && { agentId: query.agentId }),
      ...(query.leadId && { leadId: query.leadId }),
    };

    const [visits, total] = await Promise.all([
      siteVisitRepository.findMany(where, skip, limit, buildSortOrder(query.sortBy || 'scheduledAt', query.sortOrder)),
      siteVisitRepository.count(where),
    ]);

    return { data: visits, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const visit = await siteVisitRepository.findById(id);
    if (!visit) throw new NotFoundError('Site visit not found');
    return visit;
  }

  async create(dto: CreateSiteVisitDto) {
    const visit = await siteVisitRepository.create({
      scheduledAt: new Date(dto.scheduledAt),
      notes: dto.notes,
      lead: { connect: { id: dto.leadId } },
      agent: { connect: { id: dto.agentId } },
      ...(dto.propertyId && { propertyId: dto.propertyId }),
      ...(dto.projectId && { projectId: dto.projectId }),
    });

    await leadRepository.createTimelineEntry({
      action: 'SITE_VISIT_SCHEDULED',
      description: `Site visit scheduled for ${dto.scheduledAt}`,
      lead: { connect: { id: dto.leadId } },
      performedBy: { connect: { id: dto.agentId } },
    });

    return visit;
  }

  async update(id: string, dto: UpdateSiteVisitDto) {
    const visit = await siteVisitRepository.findById(id);
    if (!visit) throw new NotFoundError('Site visit not found');

    return siteVisitRepository.update(id, {
      ...(dto.scheduledAt && { scheduledAt: new Date(dto.scheduledAt) }),
      ...(dto.status && { status: dto.status }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    });
  }

  async submitFeedback(id: string, dto: VisitFeedbackDto) {
    const visit = await siteVisitRepository.findById(id);
    if (!visit) throw new NotFoundError('Site visit not found');

    const updated = await siteVisitRepository.update(id, {
      feedback: dto.feedback,
      rating: dto.rating,
      status: VisitStatus.COMPLETED,
      completedAt: new Date(),
    });

    await leadRepository.createTimelineEntry({
      action: 'SITE_VISIT_COMPLETED',
      description: `Site visit completed with rating ${dto.rating || 'N/A'}`,
      metadata: { feedback: dto.feedback, rating: dto.rating },
      lead: { connect: { id: visit.leadId } },
      performedBy: { connect: { id: visit.agentId } },
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    const visit = await siteVisitRepository.findById(id);
    if (!visit) throw new NotFoundError('Site visit not found');
    await siteVisitRepository.softDelete(id);
  }
}

export default new SiteVisitService();
