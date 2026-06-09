import { PaginationResponseInterface } from '../pagination-response.interface';
import { AmenityResponseInterface } from './amenity-response.interface';

export interface AmenitiesResponseInterface {
  data: AmenityResponseInterface[];
  pagination: PaginationResponseInterface;
}
