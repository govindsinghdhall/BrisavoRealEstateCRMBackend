import leadSourceRepository from './lead-source.repository';
import { CreateLeadSourceDto, UpdateLeadSourceDto } from './dto/lead-source.dto';
import {
  PaginationDto,
  buildPaginationMeta,
  getPaginationParams,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import { NotFoundError, ConflictError } from '../../common/errors/app.error';

export class LeadSourceService {
  async findAll(query: PaginationDto): Promise<PaginatedResult<unknown>> {
    const { page, limit, skip } = getPaginationParams(query);
    const [sources, total] = await Promise.all([
      leadSourceRepository.findMany(skip, limit),
      leadSourceRepository.count(),
    ]);
    return { data: sources, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const source = await leadSourceRepository.findById(id);
    if (!source) throw new NotFoundError('Lead source not found');
    return source;
  }

  async create(dto: CreateLeadSourceDto, organizationId: string) {
    return leadSourceRepository.create({
      ...dto,
      organization: { connect: { id: organizationId } },
    });
  }

  async update(id: string, dto: UpdateLeadSourceDto) {
    const source = await leadSourceRepository.findById(id);
    if (!source) throw new NotFoundError('Lead source not found');
    return leadSourceRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    const source = await leadSourceRepository.findById(id);
    if (!source) throw new NotFoundError('Lead source not found');
    await leadSourceRepository.softDelete(id);
  }
}

export default new LeadSourceService();
