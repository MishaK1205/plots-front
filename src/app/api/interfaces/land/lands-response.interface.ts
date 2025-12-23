import { PaginationResponseInterface } from '../pagination-response.interface';
import { LandResponseInterface } from './land-response.interface';

export interface LandsResponseInterface {
  data: LandResponseInterface[];
  pagination: PaginationResponseInterface;
}
