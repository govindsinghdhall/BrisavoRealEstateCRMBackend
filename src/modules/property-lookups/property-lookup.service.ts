import propertyLookupRepository from './property-lookup.repository';
import { DEFAULT_PROPERTY_LOOKUPS, PropertyLookupTypeEnum } from './property-lookup.constants';
import { CreatePropertyLookupDto } from './dto/property-lookup.dto';
import { normalizeLookupKey, normalizeLookupValue, validateLookupValue } from './property-lookup.util';

type LookupGroup = Record<PropertyLookupTypeEnum, string[]>;

function mergeUniqueValues(...lists: Array<readonly string[] | string[]>): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const list of lists) {
    for (const item of list) {
      const key = normalizeLookupKey(item);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(normalizeLookupValue(item));
    }
  }

  return merged;
}

function emptyGroup(): LookupGroup {
  return {
    LOCALITY: [],
    SECTOR: [],
    LANDMARK: [],
    PINCODE: [],
    BUILDER: [],
  };
}

export class PropertyLookupService {
  private buildGrouped(organizationId: string, type?: PropertyLookupTypeEnum): Promise<LookupGroup> {
    return propertyLookupRepository
      .findAll(organizationId)
      .then((rows) => {
        const grouped = emptyGroup();
        for (const row of rows) {
          grouped[row.type].push(row.value);
        }

        (Object.keys(DEFAULT_PROPERTY_LOOKUPS) as PropertyLookupTypeEnum[]).forEach((lookupType) => {
          grouped[lookupType] = mergeUniqueValues(
            DEFAULT_PROPERTY_LOOKUPS[lookupType],
            grouped[lookupType],
          );
        });

        if (type) {
          return { ...emptyGroup(), [type]: grouped[type] };
        }

        return grouped;
      });
  }

  async findAll(organizationId: string, type?: PropertyLookupTypeEnum): Promise<LookupGroup> {
    return this.buildGrouped(organizationId, type);
  }

  async create(dto: CreatePropertyLookupDto, organizationId: string) {
    const value = validateLookupValue(dto.type, dto.value);
    const normalizedValue = normalizeLookupKey(value);

    const existing = await propertyLookupRepository.findByNormalized(
      organizationId,
      dto.type,
      normalizedValue,
    );

    if (existing) {
      return propertyLookupRepository.incrementUsage(existing.id);
    }

    return propertyLookupRepository.create({
      type: dto.type,
      value,
      normalizedValue,
      organization: { connect: { id: organizationId } },
    });
  }

  async ensure(organizationId: string, type: PropertyLookupTypeEnum, rawValue?: string | null) {
    if (!rawValue?.trim()) return null;
    return this.create({ type, value: rawValue }, organizationId);
  }

  async ensureFromProperty(
    organizationId: string,
    data: {
      locality?: string | null;
      sector?: string | null;
      landmark?: string | null;
      pincode?: string | null;
      builderName?: string | null;
    },
  ) {
    await Promise.all([
      this.ensure(organizationId, PropertyLookupTypeEnum.LOCALITY, data.locality),
      this.ensure(organizationId, PropertyLookupTypeEnum.SECTOR, data.sector),
      this.ensure(organizationId, PropertyLookupTypeEnum.LANDMARK, data.landmark),
      this.ensure(organizationId, PropertyLookupTypeEnum.PINCODE, data.pincode),
      this.ensure(organizationId, PropertyLookupTypeEnum.BUILDER, data.builderName),
    ]);
  }

  async seedDefaultsForOrganization(organizationId: string) {
    const tasks: Promise<unknown>[] = [];

    (Object.keys(DEFAULT_PROPERTY_LOOKUPS) as PropertyLookupTypeEnum[]).forEach((type) => {
      for (const value of DEFAULT_PROPERTY_LOOKUPS[type]) {
        tasks.push(this.ensure(organizationId, type, value));
      }
    });

    await Promise.all(tasks);
  }
}

export default new PropertyLookupService();
