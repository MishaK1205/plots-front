/**
 * Interface for creating a new project
 */
export interface CreateProjectInterface {
  /**
   * Project name (2-255 characters)
   */
  name: string;

  /**
   * Project description (10-2000 characters)
   */
  description: string;

  /**
   * Location latitude (-90 to 90)
   */
  latitude: number;

  /**
   * Location longitude (-180 to 180)
   */
  longitude: number;

  /**
   * Location name or address (5-500 characters)
   */
  locationName: string;

  /**
   * Array of project photo URLs (optional)
   */
  photos?: string[];

  /**
   * Cover photo URL (optional)
   */
  coverPhotoUrl?: string;

  /**
   * Project video URL (optional)
   */
  videoUrl?: string;

  /**
   * Property type
   */
  propertyType: 'land' | 'land_with_house';

  /**
   * Available communications and utilities (optional)
   */
  communications?: Array<{
    type: string;
    available: boolean;
    description?: string;
  }>;

  /**
   * Project status (optional)
   */
  status?: 'ACTIVE' | 'INACTIVE';

  /**
   * Company ID this project belongs to (UUID)
   */
  companyId: string;
}
