import { CommunicationType } from "../../../shared";

export interface CreateProjectInterface {
  name: string;
  description: string;
  photos?: string[];
  cardPhotoId?: string;
  coverPhotoId?: string;
  videoUrl?: string;
  propertyType: 'land' | 'land_with_house';
  location: {
    streetName: string;
    city: string;
    district: string;
    latitude: number;
    longitude: number;
  };
  communications?: Array<CommunicationType>;
  status?: 'ACTIVE' | 'INACTIVE';
  companyId: string;
}
