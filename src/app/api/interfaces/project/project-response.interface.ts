import { CommunicationType } from "../../../shared";

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
  propertyType: 'land' | 'land_with_house';
  communications: Array<CommunicationType>;
  location: {
    streetName: string;
    city: string;
    district: string;
    latitude: number;
    longitude: number;
  }
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  companyId: string;
}
