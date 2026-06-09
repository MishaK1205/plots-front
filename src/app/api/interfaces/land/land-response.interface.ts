import { LocalizedTextInterface } from '../localized-text.interface';

export interface LandResponseInterface {
  id: string;
  name: string;
  squareMeters: number;
  squareMeterPrice: number;
  cadastralCode: string;
  tag: LocalizedTextInterface;
  promoOffers: LocalizedTextInterface;
  totalPrice: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}
