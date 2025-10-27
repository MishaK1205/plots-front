import { components } from './types';

// Export all schema types for easy access
export type Company = components['schemas']['Company'];
export type CreateCompanyDto = components['schemas']['CreateCompanyDto'];
export type Project = components['schemas']['Project'];
export type CreateProjectDto = components['schemas']['CreateProjectDto'];
export type UpdateProjectDto = components['schemas']['UpdateProjectDto'];

// Re-export the paths and operations if needed
export type { paths, operations } from './types';
