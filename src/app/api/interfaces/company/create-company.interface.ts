export interface CreateCompanyInterface {
  name: string;
  slug: string;
  email: string;
  phone: string;
  website?: string;
  description?: string;
  logoId?: string;
  coverImageId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  location: {
    streetName: string;
    city: string;
    district: string;
    latitude: number;
    longitude: number;
  };
  socialAccounts?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
  };
}
