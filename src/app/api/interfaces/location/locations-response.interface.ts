import { PaginationResponseInterface } from '../pagination-response.interface';
import { LocationResponseInterface } from './location-response.interface';

export interface LocationsResponseInterface {
  data: LocationResponseInterface[];
  pagination: PaginationResponseInterface;
}
