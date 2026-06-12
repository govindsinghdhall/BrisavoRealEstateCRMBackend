import { Prisma } from '@prisma/client';
import organizationRepository from './organization.repository';
import { UpdateOrganizationDto } from './dto/organization.dto';
import { NotFoundError } from '../../common/errors/app.error';

export class OrganizationService {
  async getCurrent(organizationId: string) {
    const organization = await organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }
    return organization;
  }

  async updateCurrent(organizationId: string, dto: UpdateOrganizationDto) {
    const existing = await organizationRepository.findById(organizationId);
    if (!existing) {
      throw new NotFoundError('Organization not found');
    }

    const updateData: {
      name?: string;
      logo?: string | null;
      email?: string | null;
      phone?: string | null;
      address?: string | null;
      settings?: Prisma.InputJsonValue | typeof Prisma.DbNull;
    } = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.logo !== undefined) updateData.logo = dto.logo;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.address !== undefined) updateData.address = dto.address;

    if (dto.settings !== undefined) {
      const currentSettings =
        existing.settings && typeof existing.settings === 'object' && !Array.isArray(existing.settings)
          ? (existing.settings as Record<string, unknown>)
          : {};

      updateData.settings =
        dto.settings === null
          ? Prisma.DbNull
          : ({ ...currentSettings, ...dto.settings } as Prisma.InputJsonValue);
    }

    if (Object.keys(updateData).length === 0) {
      return existing;
    }

    return organizationRepository.update(organizationId, updateData);
  }

  async updateLogo(organizationId: string, logoPath: string) {
    return organizationRepository.update(organizationId, { logo: logoPath });
  }

  async updateFavicon(organizationId: string, faviconPath: string) {
    const existing = await organizationRepository.findById(organizationId);
    if (!existing) {
      throw new NotFoundError('Organization not found');
    }

    const currentSettings =
      existing.settings && typeof existing.settings === 'object' && !Array.isArray(existing.settings)
        ? (existing.settings as Record<string, unknown>)
        : {};

    return organizationRepository.update(organizationId, {
      settings: { ...currentSettings, faviconUrl: faviconPath } as Prisma.InputJsonValue,
    });
  }
}

export default new OrganizationService();
