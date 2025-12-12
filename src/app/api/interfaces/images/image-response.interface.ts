/**
 * Interface for image response from the API
 */
export interface ImageResponseInterface {
  /**
   * Unique image identifier (UUID)
   */
  id: string;

  /**
   * Original filename
   */
  originalFilename: string;

  /**
   * Generated filename
   */
  filename: string;

  /**
   * File path
   */
  path: string;

  /**
   * Image URL
   */
  imageUrl: string;

  /**
   * MIME type
   */
  mimetype: string;

  /**
   * File size in bytes
   */
  size: number;

  /**
   * Creation timestamp (ISO 8601 date string)
   */
  createdAt: string;
}

