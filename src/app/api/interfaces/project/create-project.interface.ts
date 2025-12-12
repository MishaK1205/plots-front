export interface CreateProjectInterface {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  locationName: string;
  photos?: string[];
  coverPhotoUrl?: string;
  videoUrl?: string;
  propertyType: 'land' | 'land_with_house';
  communications?: Array<{
    type: string;
    available: boolean;
    description?: string;
  }>;
  status?: 'ACTIVE' | 'INACTIVE';
  companyId: string;
}
