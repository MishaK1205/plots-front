import { ProjectCommunication } from './create-project.interface';

export interface ProjectResponseInterface {
  id: string;
  name: string;
  developerCompanyName: string;
  developerContactInfo: string;
  developerPhotoUrl?: string;
  description: string;
  photos?: string[];
  coverPhotoId?: string;
  cardPhotoId?: string;
  videoUrl?: string;
  propertyType?: 'land' | 'land_with_house';
  communications: ProjectCommunication[];
  tags?: string[];
  lowestLandTotalPrice: number;
  lowestLandSquareMeterPrice: number;
  location: {
    streetName: string;
    city: string;
    district: string;
    latitude: number;
    longitude: number;
  };
  locationName?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  companyId: string;
}
