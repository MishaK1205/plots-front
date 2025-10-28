/**
 * CreateProject interface
 * Generated from Swagger documentation
 */

export interface CreateProject {
  /** Project name */
  name: string;
  /** Project description */
  description: string;
  /** Location latitude */
  latitude: number;
  /** Location longitude */
  longitude: number;
  /** Location name or address */
  locationName: string;
  /** Array of project photo URLs */
  photos?: string[];
  /** Cover photo URL */
  coverPhotoUrl?: string;
  /** Project video URL */
  videoUrl?: string;
  /** Property type */
  propertyType: 'land' | 'land_with_house';
  /** Available communications and utilities */
  communications?: string[];
  /** Project status */
  status?: 'ACTIVE' | 'INACTIVE';
  /** Company ID this project belongs to */
  companyId: string;
}
