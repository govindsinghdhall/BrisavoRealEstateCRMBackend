import { Decimal } from '@prisma/client/runtime/library';

const POSTED_BY = 'Durga Property';

function toNumber(value: Decimal | number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === 'number' ? value : Number(value);
}

function toSnakeCase(value: string): string {
  return value.toLowerCase().replace(/_(\d)_/g, '_$1_').replace(/_/g, '_');
}

function enumToApi(value: string): string {
  const map: Record<string, string> = {
    NEW_PROJECTS: 'new_projects',
    BUILDER_FLOOR: 'builder_floor',
    COWORKING_SPACE: 'coworking_space',
    UNDER_OFFER: 'under_offer',
    UNDER_CONSTRUCTION: 'under_construction',
    READY_TO_MOVE: 'ready_to_move',
    ONE_TO_FIVE_YEARS: '1_5_years',
    FIVE_TO_TEN_YEARS: '5_10_years',
    TEN_PLUS_YEARS: '10_plus_years',
    FULLY_FURNISHED: 'fully_furnished',
    SEMI_FURNISHED: 'semi_furnished',
    WITHIN_3_MONTHS: 'within_3_months',
    WITHIN_6_MONTHS: 'within_6_months',
    WITHIN_1_YEAR: 'within_1_year',
  };
  return map[value] ?? toSnakeCase(value);
}

type PropertyRecord = Record<string, unknown>;

export function mapToPublicProperty(property: PropertyRecord) {
  const price = toNumber(property.price as Decimal);
  const area = toNumber(property.area as Decimal);
  const superArea = toNumber((property.superArea ?? property.area) as Decimal);
  const carpetArea = property.carpetArea ? toNumber(property.carpetArea as Decimal) : undefined;
  const builtUpArea = property.builtUpArea ? toNumber(property.builtUpArea as Decimal) : undefined;
  const images = (property.images as PropertyRecord[] | undefined) ?? [];

  return {
    id: property.id,
    title: property.title,
    description: property.description ?? null,
    listingCategory: enumToApi(String(property.listingCategory ?? 'BUY')),
    type: enumToApi(String(property.type)),
    status: enumToApi(String(property.status)),
    price,
    pricePerSqFt: superArea > 0 ? Math.round(price / superArea) : 0,
    area,
    carpetArea: carpetArea ?? null,
    builtUpArea: builtUpArea ?? null,
    superArea: superArea || area,
    bedrooms: property.bedrooms ?? null,
    bathrooms: property.bathrooms ?? null,
    address: property.address,
    city: property.city,
    state: property.state,
    pincode: property.pincode ?? null,
    locality: property.locality || property.city,
    sector: property.sector ?? null,
    landmark: property.landmark ?? null,
    latitude: property.latitude ? toNumber(property.latitude as Decimal) : null,
    longitude: property.longitude ? toNumber(property.longitude as Decimal) : null,
    builderName: property.builderName ?? null,
    propertyAge: property.propertyAge ? enumToApi(String(property.propertyAge)) : null,
    furnishing: property.furnishing ? enumToApi(String(property.furnishing)) : null,
    facing: property.facing ? enumToApi(String(property.facing)) : null,
    possessionStatus: property.possessionStatus
      ? enumToApi(String(property.possessionStatus))
      : null,
    possessionDate: (property.possessionDate as string) ?? null,
    roiPotential: property.roiPotential ? toNumber(property.roiPotential as Decimal) : null,
    postedBy: POSTED_BY,
    isVerified: property.isVerified ?? true,
    hasRera: property.hasRera ?? false,
    reraId: property.reraId ?? null,
    hasVideoTour: Boolean(property.videoTourUrl),
    videoTourUrl: property.videoTourUrl ?? null,
    virtualTourUrl: property.virtualTourUrl ?? null,
    brochureUrl: property.brochureUrl ?? null,
    amenities: property.amenities ?? [],
    images: images.map((img) => ({
      id: img.id,
      url: img.url,
      caption: img.caption ?? null,
      isPrimary: img.isPrimary ?? false,
    })),
  };
}
