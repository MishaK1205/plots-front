import {
  Component,
  input,
  output,
  signal,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GoogleMapsModule } from '@angular/google-maps';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  catchError,
} from 'rxjs';
import {
  GoogleMapsService,
  MapPosition,
} from '../../api/services/google-maps.service';

export interface LocationSelectedEvent {
  streetName: string;
  city: string;
  district: string;
  longitude: number;
  latitude: number;
}

@Component({
  selector: 'app-google-maps',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  templateUrl: './google-maps.html',
  styleUrl: './google-maps.scss',
})
export class GoogleMaps implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly googleMapsService = inject(GoogleMapsService);

  // Inputs
  initialLatitude = input<number | null>(null);
  initialLongitude = input<number | null>(null);
  markerTitle = input<string>('Location');

  // Outputs
  locationSelected = output<LocationSelectedEvent>();

  // State
  locationSearchControl = new FormControl('');
  locationSuggestions = signal<any[]>([]);
  center: google.maps.LatLngLiteral = this.googleMapsService.defaultCenter;
  zoom = this.googleMapsService.defaultZoom;
  mapOptions: google.maps.MapOptions = this.googleMapsService.defaultMapOptions;

  // Places API (New) - Cache and optimization
  private placesLibrary: any = null;
  private AutocompleteSuggestion: any = null;
  private AutocompleteSessionToken: any = null;
  private Place: any = null;
  private sessionToken: any = null;
  private geocodeCache = new Map<string, string>();
  private readonly CACHE_SIZE_LIMIT = 100;
  private readonly DEBOUNCE_TIME = 400; // ms
  private readonly MIN_SEARCH_LENGTH = 3;
  private isSearching = signal(false);

  ngOnInit(): void {
    this.initializeCenter();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initializeCenter(): void {
    const lat = this.initialLatitude();
    const lng = this.initialLongitude();

    if (lat !== null && lng !== null) {
      this.center = { lat: Number(lat), lng: Number(lng) };
      this.zoom = 15;
    }
  }

  async onMapInitialized(map: google.maps.Map): Promise<void> {
    try {
      await this.googleMapsService.initializeMap(map);
      await this.initializePlacesAPI();
      this.setupOptimizedLocationSearch();
      this.addInitialMarker();
    } catch (error) {
      throw error;
    }
  }

  private async initializePlacesAPI(): Promise<void> {
    try {
      this.placesLibrary = await google.maps.importLibrary('places');
      this.AutocompleteSuggestion = (this.placesLibrary as any).AutocompleteSuggestion;
      this.AutocompleteSessionToken = (this.placesLibrary as any).AutocompleteSessionToken;
      this.Place = (this.placesLibrary as any).Place;
      
      this.createNewSessionToken();
    } catch (error) {
      throw error;
    }
  }

  private createNewSessionToken(): void {
    if (this.AutocompleteSessionToken) {
      this.sessionToken = new this.AutocompleteSessionToken();
    }
  }

  private setupOptimizedLocationSearch(): void {
    this.locationSearchControl.valueChanges
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value || typeof value !== 'string' || value.length < this.MIN_SEARCH_LENGTH) {
            this.locationSuggestions.set([]);
            return of(null);
          }

          const cacheKey = this.getCacheKey(value);
          if (this.geocodeCache.has(cacheKey)) {
            const cachedResults = this.geocodeCache.get(cacheKey);

            if (cachedResults) {
              this.locationSuggestions.set(JSON.parse(cachedResults));
              return of(null);
            }
          }

          this.isSearching.set(true);
          return this.performGeocode(value);
        }),
        catchError(() => {
          this.locationSuggestions.set([]);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef$)
      )
      .subscribe((results) => {
        this.isSearching.set(false);
        
        if (results) {
          this.locationSuggestions.set(results);
        }
      });
  }

  private async performGeocode(query: string): Promise<any[]> {
    if (!this.AutocompleteSuggestion || !this.sessionToken) {
      return [];
    }
    
    return this.fetchPlacePredictions(query);
  }

  private async fetchPlacePredictions(query: string): Promise<any[]> {
    try {
      if (!this.AutocompleteSuggestion || !this.sessionToken) {
        return [];
      }

      const request = {
        input: query,
        sessionToken: this.sessionToken,
        includedRegionCodes: ['ge'],
        includedPrimaryTypes: ['establishment', 'geocode'],
        language: 'ka',
      };

      const response = await this.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      
      if (response && response.suggestions) {
        const predictions = this.processPlacePredictions(response.suggestions);
        this.cacheResults(query, predictions);
        return predictions;
      }
      
      return [];
    } catch (error) {
      return [];
    }
  }

  private processPlacePredictions(suggestions: any[]): any[] {
    return suggestions
      .filter((suggestion) => suggestion.placePrediction)
      .slice(0, 8)
      .map((suggestion) => {
        const prediction = suggestion.placePrediction;
        const text = prediction.text?.text || '';
        
        return {
          description: text,
          placePrediction: prediction,
          suggestion: suggestion,
        };
      });
  }


  private getCacheKey(query: string): string {
    return query.toLowerCase().trim();
  }

  private cacheResults(query: string, results: any[]): void {
    const cacheKey = this.getCacheKey(query);
    
    if (this.geocodeCache.size >= this.CACHE_SIZE_LIMIT) {
      const firstKey = this.geocodeCache.keys().next().value;
      if (firstKey) {
        this.geocodeCache.delete(firstKey);
      }
    }
    
    this.geocodeCache.set(cacheKey, JSON.stringify(results));
  }

  private clearCache(): void {
    this.geocodeCache.clear();
  }

  async onLocationSelected(prediction: any): Promise<void> {
    this.locationSearchControl.setValue(prediction.description, {
      emitEvent: false,
    });

    if (prediction.placePrediction && this.Place && this.sessionToken) {
      await this.handlePlaceSelection(prediction);
    } else {
      return;
    }
    
    this.locationSuggestions.set([]);
    
    this.createNewSessionToken();
  }

  private async handlePlaceSelection(prediction: any): Promise<void> {
    try {
      if (!prediction.placePrediction || !this.Place) {
        return;
      }

      const place = prediction.placePrediction.toPlace();
      
      await place.fetchFields({
        fields: [
          'displayName', 
          'formattedAddress', 
          'location',
          'addressComponents',
        ],
      });

      if (!place.location) {
        return;
      }

      const addressInfo = this.extractAddressInfo(place);
      
      this.handleLocationSelect({
        streetName: addressInfo.streetName,
        city: addressInfo.city,
        district: addressInfo.district,
        longitude: place.location.lng(),
        latitude: place.location.lat(),
      });
    } catch (error) {
      throw error;
    }
  }

  private extractAddressInfo(place: any): { streetName: string; city: string; district: string } {
    const components = place.addressComponents || [];
    
    const streetComponent = components.find((c: any) => 
      c.types?.includes('route')
    );
    
    const streetNumberComponent = components.find((c: any) => 
      c.types?.includes('street_number')
    );
    
    const cityComponent = components.find((c: any) => 
      c.types?.includes('locality') || 
      c.types?.includes('administrative_area_level_1')
    );
    
    const districtComponent = components.find((c: any) => 
      c.types?.includes('sublocality_level_1') ||
      c.types?.includes('sublocality') ||
      c.types?.includes('administrative_area_level_2')
    );
    
    const getComponentText = (component: any) => {
      if (!component) return '';
      return component.longText || 
             component.shortText || 
             component.longName || 
             component.shortName ||
             component.text ||
             '';
    };
    
    const streetName = streetNumberComponent && streetComponent
      ? `${getComponentText(streetNumberComponent)} ${getComponentText(streetComponent)}`
      : getComponentText(streetComponent);
    
    return {
      streetName: streetName || '',
      city: getComponentText(cityComponent),
      district: getComponentText(districtComponent),
    };
  }

  displayLocationFn(prediction: any): string {
    return prediction?.description || '';
  }

  // ==================== Map Interactions ====================

  onMapClick(event: google.maps.MapMouseEvent): void {
    const position = this.googleMapsService.extractPositionFromEvent(event);
    if (!position) return;

    this.googleMapsService.addMarker(position, this.markerTitle());
    this.reverseGeocodeAndEmit(position);
  }

  private handleLocationSelect(event: LocationSelectedEvent): void {
    const position: MapPosition = {
      lat: event.latitude,
      lng: event.longitude,
    };
    this.updateMapLocation(position, 15);
    this.locationSelected.emit(event);
  }

  private addInitialMarker(): void {
    const lat = this.initialLatitude();
    const lng = this.initialLongitude();

    if (lat !== null && lng !== null) {
      const position: MapPosition = {
        lat: Number(lat),
        lng: Number(lng),
      };
      this.googleMapsService.addMarker(position, this.markerTitle());
    }
  }

  private updateMapLocation(position: MapPosition, zoom: number): void {
    this.center = position;
    this.zoom = zoom;
    this.googleMapsService.updateLocation(position, zoom, this.markerTitle());
  }

  private async reverseGeocodeAndEmit(position: MapPosition): Promise<void> {
    try {
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode(
        {
          location: position,
          language: 'ka',
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const result = results[0];
            
            const addressInfo = this.extractAddressInfoFromGeocoder(result);
            
            this.locationSelected.emit({
              streetName: addressInfo.streetName,
              city: addressInfo.city,
              district: addressInfo.district,
              latitude: position.lat,
              longitude: position.lng,
            });
          } else {
            this.locationSelected.emit({
              streetName: '',
              city: '',
              district: '',
              latitude: position.lat,
              longitude: position.lng,
            });
          }
        }
      );
    } catch (error) {
      this.locationSelected.emit({
        streetName: '',
        city: '',
        district: '',
        latitude: position.lat,
        longitude: position.lng,
      });
    }
  }

  private extractAddressInfoFromGeocoder(result: google.maps.GeocoderResult): {
    streetName: string;
    city: string;
    district: string;
  } {
    const components = result.address_components || [];
    
    // Find street name (route)
    const streetComponent = components.find((c) => c.types.includes('route'));
    const streetNumberComponent = components.find((c) =>
      c.types.includes('street_number')
    );
    
    // Find city - try multiple types
    const cityComponent = 
      components.find((c) => c.types.includes('locality')) ||
      components.find((c) => c.types.includes('administrative_area_level_1')) ||
      components.find((c) => c.types.includes('administrative_area_level_2'));
    
    // Find district - try multiple types
    const districtComponent = 
      components.find((c) => c.types.includes('sublocality_level_1')) ||
      components.find((c) => c.types.includes('sublocality')) ||
      components.find((c) => c.types.includes('administrative_area_level_2')) ||
      components.find((c) => c.types.includes('neighborhood'));
    
    // Build street name
    let streetName = '';
    if (streetNumberComponent && streetComponent) {
      streetName = `${streetNumberComponent.long_name} ${streetComponent.long_name}`;
    } else if (streetComponent) {
      streetName = streetComponent.long_name || '';
    }
    
    return {
      streetName: streetName.trim(),
      city: cityComponent?.long_name || '',
      district: districtComponent?.long_name || '',
    };
  }

  private cleanup(): void {
    this.googleMapsService.cleanup();
    this.clearCache();
    this.locationSuggestions.set([]);
  }
}