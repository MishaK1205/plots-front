import { LocalizedTextInterface } from '../localized-text.interface';

export interface CreateCompanySocialAccounts {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  x?: string;
}

export interface CreateCompanyInterface {
  companyName: LocalizedTextInterface;
  logoId?: string;
  phone: string;
  email: string;
  address: LocalizedTextInterface;
  website?: string;
  socialAccounts?: CreateCompanySocialAccounts;
}
