export interface CreateCompanyInterface {
  name: string;
  slug: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  socialAccounts?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
  };
}
