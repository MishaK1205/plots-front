import { LocalizedTextInterface } from '../localized-text.interface';

export interface CreateLandInterface {
  name: string;
  squareMeters: number;
  squareMeterPrice: number;
  cadastralCode: string;
  tag: LocalizedTextInterface;
  promoOffers: LocalizedTextInterface;
  projectId: string;
  imageUrl?: string;
}
