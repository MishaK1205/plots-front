import { LocalizedTextInterface } from '../localized-text.interface';
import { CreateCompanySocialAccounts } from './create-company.interface';

export interface CompanyResponseInterface {
  id: string;
  companyName: LocalizedTextInterface;
  address: LocalizedTextInterface;
  slug: string;
  email: string;
  phone: string;
  website?: string;
  logoId?: string;
  createdAt: string;
  updatedAt: string;
  socialAccounts?: CreateCompanySocialAccounts;
}
