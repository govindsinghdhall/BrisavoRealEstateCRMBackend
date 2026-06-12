/** Local enum for validation — avoids circular-import issues with @IsEnum + @prisma/client */
export enum PropertyLookupTypeEnum {
  LOCALITY = 'LOCALITY',
  SECTOR = 'SECTOR',
  LANDMARK = 'LANDMARK',
  PINCODE = 'PINCODE',
  BUILDER = 'BUILDER',
}

export const DEFAULT_PROPERTY_LOOKUPS: Record<PropertyLookupTypeEnum, readonly string[]> = {
  LOCALITY: [
    'DLF Phase 1', 'DLF Phase 2', 'DLF Phase 3', 'DLF Phase 4', 'DLF Phase 5',
    'Sohna Road', 'Golf Course Road', 'Sector 57', 'Sector 62', 'Sector 65',
    'Sector 82', 'Sector 84', 'New Gurgaon', 'Dwarka Expressway', 'Manesar',
    'South City 1', 'South City 2', 'Palam Vihar', 'MG Road', 'Cyber City',
    'Udyog Vihar', 'Sector 14', 'Sector 15', 'Sector 21', 'Sector 23',
  ],
  SECTOR: [
    'Sector 14', 'Sector 15', 'Sector 21', 'Sector 23', 'Sector 27',
    'Sector 43', 'Sector 45', 'Sector 47', 'Sector 49', 'Sector 50',
    'Sector 57', 'Sector 62', 'Sector 65', 'Sector 67', 'Sector 82',
    'Sector 84', 'Sector 92', 'Sector 95', 'Sector 99', 'Sector 102',
  ],
  LANDMARK: [
    'Cyber Hub', 'Ambience Mall', 'MG Road Metro Station', 'IFFCO Chowk',
    'Golf Course Extension Road', 'Sohna Road Junction', 'Huda City Centre Metro',
    'World Mark Mall', 'South Point Mall', 'Good Earth City Centre', 'Galleria Market',
    'Golf Course Road', 'Dwarka Expressway Junction', 'NH-48', 'Rajiv Chowk',
    'Hero Honda Chowk', 'None / Not Applicable',
  ],
  PINCODE: [
    '122001', '122002', '122003', '122004', '122005', '122006', '122007', '122008',
    '122009', '122010', '122011', '122012', '122015', '122016', '122017', '122018',
    '122051', '122052', '122101', '122102', '122103',
  ],
  BUILDER: [
    'DLF Limited', 'M3M India', 'Godrej Properties', 'Tata Housing', 'Emaar India',
    'Sobha Limited', 'ATS Infrastructure', 'Vatika Group', 'Signature Global',
    'Adani Realty', 'Central Park', 'Elan Group', 'BPTP Limited', 'Experion Developers',
    'Mahindra Lifespaces',
  ],
};
