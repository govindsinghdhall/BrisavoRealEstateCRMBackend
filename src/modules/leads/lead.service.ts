import leadRepository from './lead.repository';
import {
  CreateLeadDto,
  UpdateLeadDto,
  AssignLeadDto,
  CreateLeadNoteDto,
  LeadQueryDto,
} from './dto/lead.dto';
import {
  PaginationDto,
  buildPaginationMeta,
  getPaginationParams,
  buildSearchFilter,
  buildSortOrder,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import { NotFoundError } from '../../common/errors/app.error';
import { withTenant } from '../../common/utils/tenant.util';

export class LeadService {
  async findAll(
    query: PaginationDto & LeadQueryDto,
    organizationId: string
  ): Promise<PaginatedResult<unknown>> {
    const { page, limit, skip } = getPaginationParams(query);

    const where = {
      ...withTenant(organizationId),
      ...buildSearchFilter(query.search, ['firstName', 'lastName', 'email', 'phone', 'city']),
      ...(query.status && { status: query.status }),
      ...(query.priority && { priority: query.priority }),
      ...(query.sourceId && { sourceId: query.sourceId }),
      ...(query.assignedToId && { assignedToId: query.assignedToId }),
    };

    const [leads, total] = await Promise.all([
      leadRepository.findMany(where, skip, limit, buildSortOrder(query.sortBy, query.sortOrder)),
      leadRepository.count(where),
    ]);

    return { data: leads, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new NotFoundError('Lead not found');
    return lead;
  }

  async create(dto: CreateLeadDto, createdById: string, organizationId: string) {
    const lead = await leadRepository.create({
      organization: { connect: { id: organizationId } },
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      alternatePhone: dto.alternatePhone,
      priority: dto.priority,
      budget: dto.budget,
      requirements: dto.requirements,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      pincode: dto.pincode,
      source: { connect: { id: dto.sourceId } },
      createdBy: { connect: { id: createdById } },
      ...(dto.assignedToId && { assignedTo: { connect: { id: dto.assignedToId } } }),
      ...(dto.propertyId && { property: { connect: { id: dto.propertyId } } }),
      ...(dto.projectId && { project: { connect: { id: dto.projectId } } }),
    });

    await leadRepository.createTimelineEntry({
      action: 'LEAD_CREATED',
      description: 'Lead created',
      lead: { connect: { id: lead.id } },
      performedBy: { connect: { id: createdById } },
    });

    return lead;
  }

  async update(id: string, dto: UpdateLeadDto, userId: string) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new NotFoundError('Lead not found');

    const updated = await leadRepository.update(id, {
      ...(dto.firstName && { firstName: dto.firstName }),
      ...(dto.lastName && { lastName: dto.lastName }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.phone && { phone: dto.phone }),
      ...(dto.alternatePhone !== undefined && { alternatePhone: dto.alternatePhone }),
      ...(dto.status && { status: dto.status }),
      ...(dto.priority && { priority: dto.priority }),
      ...(dto.budget !== undefined && { budget: dto.budget }),
      ...(dto.requirements !== undefined && { requirements: dto.requirements }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.city !== undefined && { city: dto.city }),
      ...(dto.state !== undefined && { state: dto.state }),
      ...(dto.pincode !== undefined && { pincode: dto.pincode }),
      ...(dto.sourceId && { source: { connect: { id: dto.sourceId } } }),
      ...(dto.propertyId !== undefined && {
        property: dto.propertyId ? { connect: { id: dto.propertyId } } : { disconnect: true },
      }),
      ...(dto.projectId !== undefined && {
        project: dto.projectId ? { connect: { id: dto.projectId } } : { disconnect: true },
      }),
    });

    if (dto.status && dto.status !== lead.status) {
      await leadRepository.createTimelineEntry({
        action: 'STATUS_CHANGED',
        description: `Status changed from ${lead.status} to ${dto.status}`,
        metadata: { oldStatus: lead.status, newStatus: dto.status },
        lead: { connect: { id: id } },
        performedBy: { connect: { id: userId } },
      });
    }

    return updated;
  }

  async assign(id: string, dto: AssignLeadDto, userId: string) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new NotFoundError('Lead not found');

    const updated = await leadRepository.update(id, {
      assignedTo: { connect: { id: dto.assignedToId } },
    });

    await leadRepository.createTimelineEntry({
      action: 'LEAD_ASSIGNED',
      description: `Lead assigned to agent`,
      metadata: { assignedToId: dto.assignedToId, previousAssignee: lead.assignedToId },
      lead: { connect: { id } },
      performedBy: { connect: { id: userId } },
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new NotFoundError('Lead not found');
    await leadRepository.softDelete(id);
  }

  async addNote(leadId: string, dto: CreateLeadNoteDto, userId: string) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw new NotFoundError('Lead not found');

    const note = await leadRepository.createNote({
      content: dto.content,
      lead: { connect: { id: leadId } },
      createdBy: { connect: { id: userId } },
    });

    await leadRepository.createTimelineEntry({
      action: 'NOTE_ADDED',
      description: 'Note added to lead',
      lead: { connect: { id: leadId } },
      performedBy: { connect: { id: userId } },
    });

    return note;
  }

  async getTimeline(leadId: string) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw new NotFoundError('Lead not found');
    return leadRepository.getTimeline(leadId);
  }
}

export default new LeadService();
