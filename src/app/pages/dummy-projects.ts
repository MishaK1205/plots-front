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
    {
      id: 'project-riverside-estates',
      name: 'Riverside Estates',
      developerCompanyName: 'Riverbank Development',
      developerContactInfo: '+1 555-246-8100',
      developerPhotoUrl: undefined,
      description:
        'Spacious riverside plots with peaceful surroundings and direct road access.',
      photos: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      ],
      coverPhotoId:
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80',
      cardPhotoId:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
      videoUrl: 'https://cdn.example.com/riverside-video.mp4',
      communications: [
        {
          type: 'gas',
          available: true,
          description: 'Natural gas available',
        },
        {
          type: 'water',
          available: true,
          description: 'River-adjacent central water supply',
        },
        {
          type: 'sewerage',
          available: true,
          description: 'Sewerage network connected',
        },
        {
          type: 'road',
          available: true,
          description: 'Main road access',
        },
        {
          type: 'electricity',
          available: true,
          description: 'Electrical grid connection',
        },
        {
          type: 'internet',
          available: false,
          description: 'Internet connection planned',
        },
      ],
      tags: ['riverside', 'quiet-area', 'road-access'],
      lowestLandTotalPrice: 78000,
      lowestLandSquareMeterPrice: 160,
      location: {
        streetName: 'River Road',
        city: 'Brookfield',
        district: 'East Bank',
        latitude: 34.0822,
        longitude: -118.1937,
      },
      locationName: 'Brookfield, East Bank',
      status: 'ACTIVE',
      createdAt: '2026-02-18T11:15:00.000Z',
      updatedAt: '2026-02-18T11:15:00.000Z',
      companyId: '323e4567-e89b-12d3-a456-426614174222',
    },
    {
      id: 'project-pine-meadows',
      name: 'Pine Meadows',
      developerCompanyName: 'Meadowland Properties',
      developerContactInfo: '+1 555-314-1592',
      developerPhotoUrl: undefined,
      description:
        'Green meadow plots surrounded by pine trees, ideal for private homes.',
      photos: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      ],
      coverPhotoId:
        'https://images.unsplash.com/photo-1519821172141-b5d8d96a3899?auto=format&fit=crop&w=1600&q=80',
      cardPhotoId:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
      videoUrl: 'https://cdn.example.com/pine-meadows-video.mp4',
      communications: [
        {
          type: 'gas',
          available: false,
          description: 'Gas installation under review',
        },
        {
          type: 'water',
          available: true,
          description: 'Well and central water options',
        },
        {
          type: 'sewerage',
          available: false,
          description: 'Individual septic systems required',
        },
        {
          type: 'road',
          available: true,
          description: 'Gravel road access',
        },
        {
          type: 'electricity',
          available: true,
          description: 'Electricity available nearby',
        },
        {
          type: 'internet',
          available: true,
          description: 'Wireless internet coverage',
        },
      ],
      tags: ['forest', 'private-homes', 'green-space'],
      lowestLandTotalPrice: 39000,
      lowestLandSquareMeterPrice: 95,
      location: {
        streetName: 'Pine Lane',
        city: 'Woodhaven',
        district: 'South Meadow',
        latitude: 34.2022,
        longitude: -118.4037,
      },
      locationName: 'Woodhaven, South Meadow',
      status: 'ACTIVE',
      createdAt: '2026-03-01T08:45:00.000Z',
      updatedAt: '2026-03-01T08:45:00.000Z',
      companyId: '423e4567-e89b-12d3-a456-426614174333',
    },
    {
      id: 'project-sunset-heights',
      name: 'Sunset Heights',
      developerCompanyName: 'Skyline Land Co.',
      developerContactInfo: '+1 555-808-2026',
      developerPhotoUrl: undefined,
      description:
        'Elevated residential plots with sunset views and premium infrastructure.',
      photos: [
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      ],
      coverPhotoId:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80',
      cardPhotoId:
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80',
      videoUrl: 'https://cdn.example.com/sunset-heights-video.mp4',
      communications: [
        {
          type: 'gas',
          available: true,
          description: 'Gas connection installed',
        },
        {
          type: 'water',
          available: true,
          description: 'Central water supply',
        },
        {
          type: 'sewerage',
          available: true,
          description: 'Modern sewerage system',
        },
        {
          type: 'road',
          available: true,
          description: 'Asphalt road access',
        },
        {
          type: 'electricity',
          available: true,
          description: 'Underground electrical lines',
        },
        {
          type: 'internet',
          available: true,
          description: 'Fiber internet connection',
        },
      ],
      tags: ['premium', 'sunset-view', 'infrastructure'],
      lowestLandTotalPrice: 92000,
      lowestLandSquareMeterPrice: 210,
      location: {
        streetName: 'Sunset Boulevard',
        city: 'Westfield',
        district: 'Upper Ridge',
        latitude: 34.1722,
        longitude: -118.4637,
      },
      locationName: 'Westfield, Upper Ridge',
      status: 'ACTIVE',
      createdAt: '2026-03-14T14:20:00.000Z',
      updatedAt: '2026-03-14T14:20:00.000Z',
      companyId: '523e4567-e89b-12d3-a456-426614174444',
    },
    {
      id: 'project-orchard-park',
      name: 'Orchard Park',
      developerCompanyName: 'Harvest Estate Builders',
      developerContactInfo: '+1 555-642-3579',
      developerPhotoUrl: undefined,
      description:
        'Family-friendly plots near orchards with flexible land sizes and utilities nearby.',
      photos: [
        'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
      ],
      coverPhotoId:
        'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=80',
      cardPhotoId:
        'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80',
      videoUrl: 'https://cdn.example.com/orchard-park-video.mp4',
      communications: [
        {
          type: 'gas',
          available: true,
          description: 'Gas connection nearby',
        },
        {
          type: 'water',
          available: true,
          description: 'Central water supply connection',
        },
        {
          type: 'sewerage',
          available: false,
          description: 'Sewerage extension planned',
        },
        {
          type: 'road',
          available: true,
          description: 'Road access from Orchard Street',
        },
        {
          type: 'electricity',
          available: true,
          description: 'Electrical connection available',
        },
        {
          type: 'internet',
          available: true,
          description: 'Broadband internet available',
        },
      ],
      tags: ['family-friendly', 'orchard', 'flexible-size'],
      lowestLandTotalPrice: 54000,
      lowestLandSquareMeterPrice: 130,
      location: {
        streetName: 'Orchard Street',
        city: 'Greendale',
        district: 'Garden District',
        latitude: 34.1122,
        longitude: -118.2837,
      },
      locationName: 'Greendale, Garden District',
      status: 'ACTIVE',
      createdAt: '2026-03-28T12:00:00.000Z',
      updatedAt: '2026-03-28T12:00:00.000Z',
      companyId: '623e4567-e89b-12d3-a456-426614174555',
    },
  ],
  pagination: {
    currentPage: 1,
    limit: 10,
    totalItems: 6,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};
