/**
 * Interface for pagination metadata in API responses
 */
export interface PaginationResponseInterface {
  /**
   * Current page number (1-based)
   */
  currentPage: number;

  /**
   * Number of items per page
   */
  limit: number;

  /**
   * Total number of items across all pages
   */
  totalItems: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Whether there is a next page available
   */
  hasNextPage: boolean;

  /**
   * Whether there is a previous page available
   */
  hasPreviousPage: boolean;
}
