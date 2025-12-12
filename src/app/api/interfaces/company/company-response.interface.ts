export interface CompanyResponseInterface {
  id: string;
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
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  socialAccounts?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
  };
}
