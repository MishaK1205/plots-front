/**
 * CreateCompany interface
 * Generated from Swagger documentation
 */

export interface CreateCompany {
  /** Company name */
  name: string;
  /** Unique company slug */
  slug: string;
  /** Company email address */
  email: string;
  /** Company phone number */
  phone: string;
  /** Company website URL */
  website?: string;
  /** Company address */
  address: string;
  /** City */
  city: string;
  /** Latitude coordinate */
  latitude?: number;
  /** Longitude coordinate */
  longitude?: number;
  /** Company description */
  description?: string;
  /** Company logo URL */
  logoUrl?: string;
  /** Company cover image URL */
  coverImageUrl?: string;
  /** Company status */
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  /** Social media accounts */
  socialAccounts?: Record<string, any>;
}
