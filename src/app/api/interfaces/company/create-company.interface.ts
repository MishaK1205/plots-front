/**
 * Interface for creating a new company
 */
export interface CreateCompanyInterface {
  /**
   * Company name (2-255 characters)
   */
  name: string;

  /**
   * Unique company slug (2-255 characters)
   */
  slug: string;

  /**
   * Company email address
   */
  email: string;

  /**
   * Company phone number (10-50 characters)
   */
  phone: string;

  /**
   * Company website URL (optional)
   */
  website?: string;

  /**
   * Company address (5-500 characters)
   */
  address: string;

  /**
   * City (2-100 characters)
   */
  city: string;

  /**
   * Latitude coordinate (-90 to 90)
   */
  latitude?: number;

  /**
   * Longitude coordinate (-180 to 180)
   */
  longitude?: number;

  /**
   * Company description (max 2000 characters)
   */
  description?: string;

  /**
   * Company logo URL (optional)
   */
  logoUrl?: string;

  /**
   * Company cover image URL (optional)
   */
  coverImageUrl?: string;

  /**
   * Company status
   */
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

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
