import { LocalizedTextInterface } from '../localized-text.interface';
import { ProjectFaqsInterface } from './create-project.interface';

export interface ProjectResponseLocation {
  latitude: number;
  longitude: number;
  streetName?: string;
  city?: string;
  district?: string;
}

export interface ProjectResponseInterface {
  id: string;
  name: string;
  shortDescription: LocalizedTextInterface;
  description: LocalizedTextInterface;
  faq: ProjectFaqsInterface;
  developerCompanyName?: string;
  developerContactInfo?: string;
  developerPhotoId?: string;
  minutesToLocation: LocalizedTextInterface;
  tagline: LocalizedTextInterface;
  locationId: string;
  amenityId: string;
  photoId?: string;
  cardPhotoId?: string;
  coverPhotoId?: string;
  gallery: string[];
  location: ProjectResponseLocation;
  isFavourite: boolean;
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  lowestLandTotalPrice?: number;
  lowestLandSquareMeterPrice?: number;
}
