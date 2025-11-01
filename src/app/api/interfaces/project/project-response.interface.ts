/**
 * Interface for project response from the API
 */
export interface ProjectResponseInterface {
  /**
   * Unique project identifier (UUID)
   */
  id: string;

  /**
   * Project name
   */
  name: string;

  /**
   * Developer company name
   */
  developerCompanyName: string;

  /**
   * Developer company contact information
   */
  developerContactInfo: string;

  /**
   * Developer company photo URL
   */
  developerPhotoUrl?: string;

  /**
   * Project description
   */
  description: string;

  /**
   * Location latitude
   */
  latitude: number;

  /**
   * Location longitude
   */
  longitude: number;

  /**
   * Location name or address
   */
  locationName: string;

  /**
   * Array of project photo URLs
   */
  photos?: string[];

  /**
   * Cover photo URL
   */
  coverPhotoUrl?: string;

  /**
   * Project video URL
   */
  videoUrl?: string;

  /**
   * Property type
   */
  propertyType: 'land' | 'land_with_house';

  /**
   * Available communications and utilities
   */
  communications: Array<{
    type: string;
    available: boolean;
    description?: string;
  }>;

  /**
   * Project status
   */
  status: 'ACTIVE' | 'INACTIVE';

  /**
   * Creation timestamp (ISO 8601 date string)
   */
  createdAt: string;

  /**
   * Last update timestamp (ISO 8601 date string)
   */
  updatedAt: string;

  /**
   * Company ID this project belongs to (UUID)
   */
  companyId: string;
}
