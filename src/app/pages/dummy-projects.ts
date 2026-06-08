import { ProjectsResponseInterface } from '../api/interfaces';

export const DUMMY_PROJECTS_RESPONSE: ProjectsResponseInterface = {
  data: [
    {
      id: 'project-green-valley',
      name: 'Green Valley Residential',
      developerCompanyName: 'Green Homes Developers',
      developerContactInfo: '+1 555-123-4567',
      developerPhotoUrl: undefined,
      description:
        'Beautiful residential plots in a prime location with modern amenities.',
      photos: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      ],
      coverPhotoId:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      cardPhotoId:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
      videoUrl: 'https://cdn.example.com/video.mp4',
      communications: [
        {
          type: 'gas',
          available: true,
          description: 'Natural gas connection',
        },
        {
          type: 'water',
          available: true,
          description: 'Water supply connection',
        },
        {
          type: 'sewerage',
          available: false,
          description: 'Sewerage system',
        },
        {
          type: 'road',
          available: true,
          description: 'Road access',
        },
        {
          type: 'electricity',
          available: true,
          description: 'Electrical connection',
        },
        {
          type: 'internet',
          available: false,
          description: 'Internet connection',
        },
      ],
      tags: ['residential', 'eco-friendly', 'prime-location'],
      lowestLandTotalPrice: 45000,
      lowestLandSquareMeterPrice: 120,
      location: {
        streetName: 'Palm Street',
        city: 'New City',
        district: 'Central District',
        latitude: 34.0522,
        longitude: -118.2437,
      },
      locationName: 'New City, Central District',
      status: 'ACTIVE',
      createdAt: '2026-01-12T10:00:00.000Z',
      updatedAt: '2026-01-12T10:00:00.000Z',
      companyId: '123e4567-e89b-12d3-a456-426614174000',
    },
    {
      id: 'project-hillside-gardens',
      name: 'Hillside Gardens',
      developerCompanyName: 'Urban Plot Group',
      developerContactInfo: '+1 555-987-6543',
      developerPhotoUrl: undefined,
      description:
        'Quiet hillside plots with open views, road access, and utility connections nearby.',
      photos: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
      ],
      coverPhotoId:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      cardPhotoId:
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80',
      videoUrl: 'https://cdn.example.com/hillside-video.mp4',
      communications: [
        {
          type: 'gas',
          available: false,
          description: 'Gas connection planned',
        },
        {
          type: 'water',
          available: true,
          description: 'Central water supply',
        },
        {
          type: 'sewerage',
          available: true,
          description: 'Connected sewerage system',
        },
        {
          type: 'road',
          available: true,
          description: 'Paved road access',
        },
        {
          type: 'electricity',
          available: true,
          description: 'Electrical connection available',
        },
        {
          type: 'internet',
          available: true,
          description: 'Fiber internet available',
        },
      ],
      tags: ['hillside', 'views', 'utilities'],
      lowestLandTotalPrice: 62000,
      lowestLandSquareMeterPrice: 145,
      location: {
        streetName: 'Oak Avenue',
        city: 'Hilltown',
        district: 'North Ridge',
        latitude: 34.1322,
        longitude: -118.3537,
      },
      locationName: 'Hilltown, North Ridge',
      status: 'ACTIVE',
      createdAt: '2026-02-03T09:30:00.000Z',
      updatedAt: '2026-02-03T09:30:00.000Z',
      companyId: '223e4567-e89b-12d3-a456-426614174111',
    },
  ],
  pagination: {
    currentPage: 1,
    limit: 10,
    totalItems: 2,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};
