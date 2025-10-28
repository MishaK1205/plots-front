/**
 * Project interface
 * Generated from Swagger documentation
 */

export interface Project {
  /** Unique project identifier */
  id: string;
  /** Project name */
  name: string;
  /** Developer company name */
  developerCompanyName: string;
  /** Developer company contact information */
  developerContactInfo: string;
  /** Developer company photo URL */
  developerPhotoUrl?: string;
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
  communications: string[];
  /** Project status */
  status: 'ACTIVE' | 'INACTIVE';
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Company ID this project belongs to */
  companyId: string;
}
