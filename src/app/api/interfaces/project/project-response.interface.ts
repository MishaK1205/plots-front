export interface ProjectResponseInterface {
  id: string;
  name: string;
  developerCompanyName: string;
  developerContactInfo: string;
  developerPhotoUrl?: string;
  description: string;
  latitude: number;
  longitude: number;
  locationName: string;
  photos?: string[];
  coverPhotoUrl?: string;
  videoUrl?: string;
  propertyType: 'land' | 'land_with_house';
  communications: Array<{
    type: string;
    available: boolean;
    description?: string;
  }>;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  companyId: string;
}
