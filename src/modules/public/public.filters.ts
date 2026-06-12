import {
  Facing,
  Furnishing,
  ListingCategory,
  PossessionStatus,
  Prisma,
  PropertyAge,
  PropertyStatus,
  PropertyType,
} from '@prisma/client';

const AMENITY_SLUG_MAP: Record<string, string> = {
  swimming_pool: 'Swimming Pool',
  gym: 'Gym',
  club_house: 'Club House',
  power_backup: 'Power Backup',
  lift: 'Lift',
  parking: 'Parking',
  security: 'Security',
  garden: 'Garden',
  kids_play_area: 'Kids Play Area',
  ev_charging: 'EV Charging',
};

const CATEGORY_MAP: Record<string, ListingCategory> = {
  buy: ListingCategory.BUY,
  rent: ListingCategory.RENT,
  commercial: ListingCategory.COMMERCIAL,
  new_projects: ListingCategory.NEW_PROJECTS,
  pg: ListingCategory.PG,
  plot: ListingCategory.PLOT,
  luxury: ListingCategory.LUXURY,
};

const TYPE_MAP: Record<string, PropertyType> = {
  apartment: PropertyType.APARTMENT,
  builder_floor: PropertyType.BUILDER_FLOOR,
  villa: PropertyType.VILLA,
  plot: PropertyType.PLOT,
  commercial: PropertyType.COMMERCIAL,
  office: PropertyType.OFFICE,
  shop: PropertyType.SHOP,
  warehouse: PropertyType.WAREHOUSE,
  coworking_space: PropertyType.COWORKING_SPACE,
};

const STATUS_MAP: Record<string, PropertyStatus> = {
  available: PropertyStatus.AVAILABLE,
  under_offer: PropertyStatus.UNDER_OFFER,
};

const AGE_MAP: Record<string, PropertyAge> = {
  under_construction: PropertyAge.UNDER_CONSTRUCTION,
  ready_to_move: PropertyAge.READY_TO_MOVE,
  new: PropertyAge.NEW,
  '1_5_years': PropertyAge.ONE_TO_FIVE_YEARS,
  '5_10_years': PropertyAge.FIVE_TO_TEN_YEARS,
  '10_plus_years': PropertyAge.TEN_PLUS_YEARS,
};

const FURNISHING_MAP: Record<string, Furnishing> = {
  fully_furnished: Furnishing.FULLY_FURNISHED,
  semi_furnished: Furnishing.SEMI_FURNISHED,
  unfurnished: Furnishing.UNFURNISHED,
};

const FACING_MAP: Record<string, Facing> = {
  north: Facing.NORTH,
  south: Facing.SOUTH,
  east: Facing.EAST,
  west: Facing.WEST,
};

const POSSESSION_MAP: Record<string, PossessionStatus> = {
  immediate: PossessionStatus.IMMEDIATE,
  within_3_months: PossessionStatus.WITHIN_3_MONTHS,
  within_6_months: PossessionStatus.WITHIN_6_MONTHS,
  within_1_year: PossessionStatus.WITHIN_1_YEAR,
};

function parseList(value?: string): string[] {
  if (!value) return [];
  return value.split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);
}

function parseNumber(value?: string | number): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function bhkToBedrooms(bhk: string): number | '5_plus' | undefined {
  if (bhk === 'studio') return 0;
  if (bhk === '5_plus_bhk') return '5_plus';
  const match = bhk.match(/^(\d+)_bhk$/);
  return match ? Number(match[1]) : undefined;
}

export interface PublicPropertyQuery {
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  city?: string;
  locality?: string;
  sector?: string;
  pincode?: string;
  landmark?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  minArea?: string | number;
  maxArea?: string | number;
  bedrooms?: string | number;
  bhk?: string;
  amenities?: string;
  propertyAge?: string;
  furnishing?: string;
  facing?: string;
  possessionStatus?: string;
  builderName?: string;
}

export function buildPublicPropertyWhere(query: PublicPropertyQuery): Prisma.PropertyWhereInput {
  const andConditions: Prisma.PropertyWhereInput[] = [{ isActive: true }];

  const statuses = parseList(query.status);
  if (statuses.length) {
    const mapped = statuses.map((s) => STATUS_MAP[s]).filter(Boolean);
    if (mapped.length) andConditions.push({ status: { in: mapped } });
  } else {
    andConditions.push({ status: PropertyStatus.AVAILABLE });
  }

  if (query.search) {
    const q = query.search.trim();
    andConditions.push({
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { locality: { contains: q, mode: 'insensitive' } },
        { sector: { contains: q, mode: 'insensitive' } },
        { landmark: { contains: q, mode: 'insensitive' } },
        { builderName: { contains: q, mode: 'insensitive' } },
      ],
    });
  }

  if (query.category) {
    const category = CATEGORY_MAP[query.category.toLowerCase()];
    if (category) andConditions.push({ listingCategory: category });
  }

  const types = parseList(query.type);
  if (types.length) {
    const mapped = types.map((t) => TYPE_MAP[t]).filter(Boolean);
    if (mapped.length) andConditions.push({ type: { in: mapped } });
  }

  if (query.city) andConditions.push({ city: { equals: query.city, mode: 'insensitive' } });
  if (query.locality) andConditions.push({ locality: { contains: query.locality, mode: 'insensitive' } });
  if (query.sector) andConditions.push({ sector: { contains: query.sector, mode: 'insensitive' } });
  if (query.pincode) andConditions.push({ pincode: { contains: query.pincode } });
  if (query.landmark) andConditions.push({ landmark: { contains: query.landmark, mode: 'insensitive' } });
  if (query.builderName) {
    andConditions.push({ builderName: { contains: query.builderName, mode: 'insensitive' } });
  }

  const minPrice = parseNumber(query.minPrice);
  const maxPrice = parseNumber(query.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    andConditions.push({
      price: {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      },
    });
  }

  const minArea = parseNumber(query.minArea);
  const maxArea = parseNumber(query.maxArea);
  if (minArea !== undefined || maxArea !== undefined) {
    andConditions.push({
      area: {
        ...(minArea !== undefined ? { gte: minArea } : {}),
        ...(maxArea !== undefined ? { lte: maxArea } : {}),
      },
    });
  }

  const minBedrooms = parseNumber(query.bedrooms);
  if (minBedrooms !== undefined) {
    andConditions.push({ bedrooms: { gte: minBedrooms } });
  }

  const bhkList = parseList(query.bhk);
  if (bhkList.length) {
    const exact: number[] = [];
    let hasFivePlus = false;
    for (const bhk of bhkList) {
      const mapped = bhkToBedrooms(bhk);
      if (mapped === '5_plus') hasFivePlus = true;
      else if (mapped !== undefined) exact.push(mapped);
    }

    if (hasFivePlus && exact.length === 0) {
      andConditions.push({ bedrooms: { gte: 5 } });
    } else if (hasFivePlus) {
      andConditions.push({
        OR: [{ bedrooms: { in: exact } }, { bedrooms: { gte: 5 } }],
      });
    } else if (exact.length) {
      andConditions.push({ bedrooms: { in: exact } });
    }
  }

  const ages = parseList(query.propertyAge).map((a) => AGE_MAP[a]).filter(Boolean);
  if (ages.length) andConditions.push({ propertyAge: { in: ages } });

  const furnishing = parseList(query.furnishing).map((f) => FURNISHING_MAP[f]).filter(Boolean);
  if (furnishing.length) andConditions.push({ furnishing: { in: furnishing } });

  const facing = parseList(query.facing).map((f) => FACING_MAP[f]).filter(Boolean);
  if (facing.length) andConditions.push({ facing: { in: facing } });

  const possession = parseList(query.possessionStatus).map((p) => POSSESSION_MAP[p]).filter(Boolean);
  if (possession.length) andConditions.push({ possessionStatus: { in: possession } });

  const amenitySlugs = parseList(query.amenities);
  if (amenitySlugs.length) {
    const labels = amenitySlugs.map((slug) => AMENITY_SLUG_MAP[slug] ?? slug);
    andConditions.push({
      OR: labels.map((label) => ({ amenities: { has: label } })),
    });
  }

  return { AND: andConditions };
}
