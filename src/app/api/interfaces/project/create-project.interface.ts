export type ProjectCommunicationType =
  | 'gas'
  | 'water'
  | 'sewerage'
  | 'road'
  | 'electricity'
  | 'internet';

export interface ProjectCommunication {
  type: ProjectCommunicationType;
  available: boolean;
  description: string;
}

export interface CreateProjectLocation {
  streetName: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
}

export type CreateProjectStatus = 'ACTIVE' | 'INACTIVE';

export interface CreateProjectInterface {
  name: string;
  description: string;
  location: CreateProjectLocation;
  cardPhotoId?: string;
  coverPhotoId?: string;
  photos?: string[];
  videoUrl?: string;
  communications: ProjectCommunication[];
  tags?: string[];
  status?: CreateProjectStatus;
  companyId: string;
}
