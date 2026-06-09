import { LocalizedTextInterface } from '../localized-text.interface';

export interface ProjectFaqItem {
  question: string;
  answer: string;
}

export interface ProjectFaqsInterface {
  geo: ProjectFaqItem[];
  eng: ProjectFaqItem[];
  rus: ProjectFaqItem[];
}

export interface ProjectCoordinates {
  latitude: number;
  longitude: number;
}

export interface CreateProjectInterface {
  name: string;
  shortDescription: LocalizedTextInterface;
  description: LocalizedTextInterface;
  faqs: ProjectFaqsInterface;
  locationId: string;
  amenityId: string;
  minutesToLocation: LocalizedTextInterface;
  tagline: LocalizedTextInterface;
  photoId?: string;
  coverPhotoId?: string;
  gallery: string[];
  location: ProjectCoordinates;
  isFavourite: boolean;
  isActive: boolean;
  companyId: string;
}
