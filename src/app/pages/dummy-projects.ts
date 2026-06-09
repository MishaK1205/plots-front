import {
  ProjectResponseInterface,
  ProjectsResponseInterface,
} from '../api/interfaces';

const emptyLocalized = () => ({ geo: '', eng: '', rus: '' });

const emptyFaq = () => ({ geo: [], eng: [], rus: [] });

interface DummyProjectSeed {
  id: string;
  name: string;
  developerCompanyName: string;
  shortDescription: string;
  cardPhotoId: string;
  coverPhotoId: string;
  gallery: string[];
  lowestLandTotalPrice: number;
  lowestLandSquareMeterPrice: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  companyId: string;
}

const SEEDS: DummyProjectSeed[] = [
  {
    id: 'project-green-valley',
    name: 'Green Valley Residential',
    developerCompanyName: 'Green Homes Developers',
    shortDescription:
      'Beautiful residential plots in a prime location with modern amenities.',
    cardPhotoId:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    coverPhotoId:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
    lowestLandTotalPrice: 45000,
    lowestLandSquareMeterPrice: 120,
    latitude: 34.0522,
    longitude: -118.2437,
    createdAt: '2026-01-12T10:00:00.000Z',
    companyId: '123e4567-e89b-12d3-a456-426614174000',
  },
  {
    id: 'project-hillside-gardens',
    name: 'Hillside Gardens',
    developerCompanyName: 'Urban Plot Group',
    shortDescription:
      'Quiet hillside plots with open views, road access, and utility connections nearby.',
    cardPhotoId:
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80',
    coverPhotoId:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
    ],
    lowestLandTotalPrice: 62000,
    lowestLandSquareMeterPrice: 145,
    latitude: 34.1322,
    longitude: -118.3537,
    createdAt: '2026-02-03T09:30:00.000Z',
    companyId: '223e4567-e89b-12d3-a456-426614174111',
  },
  {
    id: 'project-riverside-estates',
    name: 'Riverside Estates',
    developerCompanyName: 'Riverbank Development',
    shortDescription:
      'Spacious riverside plots with peaceful surroundings and direct road access.',
    cardPhotoId:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    coverPhotoId:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    ],
    lowestLandTotalPrice: 78000,
    lowestLandSquareMeterPrice: 160,
    latitude: 34.0822,
    longitude: -118.1937,
    createdAt: '2026-02-18T11:15:00.000Z',
    companyId: '323e4567-e89b-12d3-a456-426614174222',
  },
  {
    id: 'project-pine-meadows',
    name: 'Pine Meadows',
    developerCompanyName: 'Meadowland Properties',
    shortDescription:
      'Green meadow plots surrounded by pine trees, ideal for private homes.',
    cardPhotoId:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    coverPhotoId:
      'https://images.unsplash.com/photo-1519821172141-b5d8d96a3899?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    ],
    lowestLandTotalPrice: 39000,
    lowestLandSquareMeterPrice: 95,
    latitude: 34.2022,
    longitude: -118.4037,
    createdAt: '2026-03-01T08:45:00.000Z',
    companyId: '423e4567-e89b-12d3-a456-426614174333',
  },
  {
    id: 'project-sunset-heights',
    name: 'Sunset Heights',
    developerCompanyName: 'Skyline Land Co.',
    shortDescription:
      'Elevated residential plots with sunset views and premium infrastructure.',
    cardPhotoId:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80',
    coverPhotoId:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    ],
    lowestLandTotalPrice: 92000,
    lowestLandSquareMeterPrice: 210,
    latitude: 34.1722,
    longitude: -118.4637,
    createdAt: '2026-03-14T14:20:00.000Z',
    companyId: '523e4567-e89b-12d3-a456-426614174444',
  },
  {
    id: 'project-orchard-park',
    name: 'Orchard Park',
    developerCompanyName: 'Harvest Estate Builders',
    shortDescription:
      'Family-friendly plots near orchards with flexible land sizes and utilities nearby.',
    cardPhotoId:
      'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80',
    coverPhotoId:
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    ],
    lowestLandTotalPrice: 54000,
    lowestLandSquareMeterPrice: 130,
    latitude: 34.1122,
    longitude: -118.2837,
    createdAt: '2026-03-28T12:00:00.000Z',
    companyId: '623e4567-e89b-12d3-a456-426614174555',
  },
];

const toProject = (seed: DummyProjectSeed): ProjectResponseInterface => ({
  id: seed.id,
  name: seed.name,
  shortDescription: {
    geo: seed.shortDescription,
    eng: seed.shortDescription,
    rus: seed.shortDescription,
  },
  description: emptyLocalized(),
  faq: emptyFaq(),
  developerCompanyName: seed.developerCompanyName,
  minutesToLocation: emptyLocalized(),
  tagline: emptyLocalized(),
  locationId: '',
  amenityId: '',
  photoId: seed.cardPhotoId,
  cardPhotoId: seed.cardPhotoId,
  coverPhotoId: seed.coverPhotoId,
  gallery: seed.gallery,
  location: {
    latitude: seed.latitude,
    longitude: seed.longitude,
  },
  isFavourite: false,
  isActive: true,
  status: 'ACTIVE',
  createdAt: seed.createdAt,
  updatedAt: seed.createdAt,
  companyId: seed.companyId,
  lowestLandTotalPrice: seed.lowestLandTotalPrice,
  lowestLandSquareMeterPrice: seed.lowestLandSquareMeterPrice,
});

export const DUMMY_PROJECTS_RESPONSE: ProjectsResponseInterface = {
  data: SEEDS.map(toProject),
  pagination: {
    currentPage: 1,
    limit: 10,
    totalItems: SEEDS.length,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};
