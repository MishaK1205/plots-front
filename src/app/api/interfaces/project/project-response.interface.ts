import { LocalizedTextInterface } from '../localized-text.interface';
import { CompanyResponseInterface } from '../company/company-response.interface';
import { ProjectFaqsInterface } from './create-project.interface';

export interface ProjectResponseLocation {
  latitude: number;
  longitude: number;
}

export interface ProjectResponseInterface {
  id: string;
  name: string;
  shortDescription: LocalizedTextInterface;
  description: LocalizedTextInterface;
  faq: ProjectFaqsInterface;
  companyInfo?: CompanyResponseInterface;
  minutesToLocation: LocalizedTextInterface;
  tagline: LocalizedTextInterface;
  locationId: string;
  locationName: LocalizedTextInterface;
  amenityId: string;
  photoId?: string;
  coverPhotoId?: string;
  gallery: string[];
  location: ProjectResponseLocation;
  isFavourite: boolean;
  isSponsored: boolean;
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  lowestLandTotalPrice?: number;
  lowestLandSquareMeterPrice?: number;
  lowestLandSquareMeters?: number;
}
