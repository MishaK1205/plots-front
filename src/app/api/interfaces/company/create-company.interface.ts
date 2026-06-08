export type CreateCompanyStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface CreateCompanyLocation {
  streetName: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
}

export interface CreateCompanySocialAccounts {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface CreateCompanyInterface {
  name: string;
  email: string;
  phone: string;
  website?: string;
  description?: string;
  logoId?: string;
  coverImageId?: string;
  status?: CreateCompanyStatus;
  location: CreateCompanyLocation;
  socialAccounts?: CreateCompanySocialAccounts;
}
