/**
 * Interface for company response from the API
 */
export interface CompanyResponseInterface {
  /**
   * Unique company identifier (UUID)
   */
  id: string;

  /**
   * Company name
   */
  name: string;

  /**
   * Unique company slug
   */
  slug: string;

  /**
   * Company email address
   */
  email: string;

  /**
   * Company phone number
   */
  phone: string;

  /**
   * Company website URL
   */
  website?: string;

  /**
   * Company address
   */
  address: string;

  /**
   * City
   */
  city: string;

  /**
   * Latitude coordinate
   */
  latitude?: number;

  /**
   * Longitude coordinate
   */
  longitude?: number;

  /**
   * Company description
   */
  description?: string;

  /**
   * Company logo URL
   */
  logoUrl?: string;

  /**
   * Company cover image URL
   */
  coverImageUrl?: string;

  /**
   * Company status
   */
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

  /**
   * Creation timestamp (ISO 8601 date string)
   */
  createdAt: string;

  /**
   * Last update timestamp (ISO 8601 date string)
   */
  updatedAt: string;

  /**
   * Social media accounts
   */
  socialAccounts?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
  };
}
