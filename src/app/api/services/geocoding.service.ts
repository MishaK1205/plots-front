import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface AddressInfo {
  streetName: string;
  city: string;
  district: string;
}

export interface PlaceSuggestion extends AddressInfo {
  description: string;
  latitude: number;
  longitude: number;
}

interface PhotonProperties {
  name?: string;
  housenumber?: string;
  street?: string;
  city?: string;
  locality?: string;
  town?: string;
  village?: string;
  district?: string;
  suburb?: string;
  neighbourhood?: string;
  county?: string;
  state?: string;
  country?: string;
}

interface PhotonFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: PhotonProperties;
}

interface PhotonResponse {
  features: PhotonFeature[];
}

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private readonly http = inject(HttpClient);

  searchPlaces(query: string): Observable<PlaceSuggestion[]> {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) {
      return of([]);
    }

    return this.http
      .get<PhotonResponse>('https://photon.komoot.io/api/', {
        params: {
          q: trimmedQuery,
          limit: '8',
          bbox: '40.0,41.0,46.8,43.7',
          lang: 'en',
        },
      })
      .pipe(
        map((response) =>
          (response.features ?? []).map((feature) =>
            this.toPlaceSuggestion(feature),
          ),
        ),
        catchError(() => of([])),
      );
  }

  reverseGeocode(latitude: number, longitude: number): Observable<AddressInfo> {
    return this.http
      .get<PhotonResponse>('https://photon.komoot.io/reverse', {
        params: {
          lat: latitude.toString(),
          lon: longitude.toString(),
        },
      })
      .pipe(
        map((response) => {
          const feature = response.features?.[0];
          if (!feature) {
            return this.emptyAddress();
          }

          return this.extractAddress(feature.properties);
        }),
        catchError(() => of(this.emptyAddress())),
      );
  }

  private toPlaceSuggestion(feature: PhotonFeature): PlaceSuggestion {
    const [longitude, latitude] = feature.geometry.coordinates;
    const address = this.extractAddress(feature.properties);

    return {
      description: this.formatDescription(feature.properties),
      latitude,
      longitude,
      ...address,
    };
  }

  private extractAddress(properties: PhotonProperties): AddressInfo {
    const streetName = [properties.housenumber, properties.street]
      .filter(Boolean)
      .join(' ')
      .trim();

    return {
      streetName,
      city:
        properties.city ||
        properties.locality ||
        properties.town ||
        properties.village ||
        '',
      district:
        properties.district ||
        properties.suburb ||
        properties.neighbourhood ||
        properties.county ||
        properties.state ||
        '',
    };
  }

  private formatDescription(properties: PhotonProperties): string {
    const parts = [
      properties.name,
      [properties.housenumber, properties.street].filter(Boolean).join(' '),
      properties.city || properties.locality || properties.town,
      properties.country,
    ].filter(Boolean);

    return [...new Set(parts)].join(', ');
  }

  private emptyAddress(): AddressInfo {
    return {
      streetName: '',
      city: '',
      district: '',
    };
  }
}
