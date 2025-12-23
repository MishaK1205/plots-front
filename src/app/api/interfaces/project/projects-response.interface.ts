import { PaginationResponseInterface } from '../pagination-response.interface';
import { ProjectResponseInterface } from './project-response.interface';

export interface ProjectsResponseInterface {
  data: ProjectResponseInterface[];
  pagination: PaginationResponseInterface;
}
