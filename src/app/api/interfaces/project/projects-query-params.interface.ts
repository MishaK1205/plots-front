export interface ProjectsQueryParamsInterface {
  locationName?: string;
  cadastralCode?: string;
  projectName?: string;
  projectId?: string;
  maxTotalPrice?: number;
  minTotalPrice?: number;
  maxSquareMeterPrice?: number;
  minSquareMeterPrice?: number;
  maxSquareMeters?: number;
  minSquareMeters?: number;
  limit?: number;
  page?: number;
  companyId?: string;
}
