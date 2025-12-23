import { Injectable, signal } from '@angular/core';

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface PlaceResult {
  position: MapPosition;
  formattedAddress: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  // Default center (Tbilisi, Georgia)
  readonly defaultCenter: MapPosition = { lat: 41.7151, lng: 44.8271 };
  readonly defaultZoom = 12;
  readonly defaultMapOptions: google.maps.MapOptions = {
    mapId: 'fccca69154ff5bebddfaa603',
  };

  // State
  private map: google.maps.Map | null = null;
  private currentMarker: google.maps.marker.AdvancedMarkerElement | null = null;
  private AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement | null = null;
  private placeAutocomplete: google.maps.places.PlaceAutocompleteElement | null = null;

  // Signals for reactive state
  isMapReady = signal(false);
  isMarkerLibraryLoaded = signal(false);

  /**
   * Initialize the map instance
   */
  async initializeMap(map: google.maps.Map): Promise<void> {
    this.map = map;
    await this.loadMarkerLibrary();
    this.isMapReady.set(true);
  }

  /**
   * Load the Advanced Marker library
   */
  private async loadMarkerLibrary(): Promise<void> {
    try {
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      this.AdvancedMarkerElement = AdvancedMarkerElement;
      this.isMarkerLibraryLoaded.set(true);
    } catch (error) {
      console.error('Error loading marker library:', error);
      throw new Error('Failed to load map markers');
    }
  }

  /**
   * Initialize Place Autocomplete in a container element
   */
  async initializePlaceAutocomplete(
    containerId: string,
    onPlaceSelect: (result: PlaceResult) => void
  ): Promise<void> {
    try {
      await google.maps.importLibrary("places");

      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`Container with id "${containerId}" not found`);
        return;
      }

      // Create the PlaceAutocompleteElement
      this.placeAutocomplete = document.createElement('gmp-place-autocomplete') as google.maps.places.PlaceAutocompleteElement;
      this.placeAutocomplete.setAttribute('placeholder', 'Search for a location...');
      this.placeAutocomplete.setAttribute('type', 'address');

      container.appendChild(this.placeAutocomplete);

      // Listen for place selection
      this.placeAutocomplete.addEventListener('gmp-placeselect', async (event: any) => {
        const place = event.place;
        if (place) {
          const result = await this.processPlaceSelection(place);
          if (result) {
            onPlaceSelect(result);
          }
        }
      });
    } catch (error) {
      console.error('Error initializing place autocomplete:', error);
      throw new Error('Failed to load place search');
    }
  }

  /**
   * Process a place selection and extract relevant data
   */
  private async processPlaceSelection(place: google.maps.places.Place): Promise<PlaceResult | null> {
    try {
      await place.fetchFields({
        fields: ['location', 'displayName', 'formattedAddress']
      });

      const location = place.location;
      if (!location) return null;

      return {
        position: {
          lat: location.lat(),
          lng: location.lng()
        },
        formattedAddress: place.formattedAddress || place.displayName || '',
        displayName: place.displayName ?? undefined
      };
    } catch (error) {
      console.error('Error processing place selection:', error);
      return null;
    }
  }

  /**
   * Add or update a marker on the map
   */
  addMarker(position: MapPosition, title: string = 'Location'): google.maps.marker.AdvancedMarkerElement | null {
    if (!this.AdvancedMarkerElement || !this.map) {
      console.warn('Map or marker library not ready');
      return null;
    }

    // Clean up existing marker
    this.removeMarker();

    // Create new marker
    this.currentMarker = new this.AdvancedMarkerElement({
      position,
      map: this.map,
      title
    });

    return this.currentMarker;
  }

  /**
   * Remove the current marker from the map
   */
  removeMarker(): void {
    if (this.currentMarker) {
      this.currentMarker.map = null;
      this.currentMarker = null;
    }
  }

  /**
   * Pan the map to a specific position and optionally set zoom
   */
  panTo(position: MapPosition, zoom?: number): void {
    if (!this.map) return;

    this.map.panTo(position);
    if (zoom !== undefined) {
      this.map.setZoom(zoom);
    }
  }

  /**
   * Update map location with marker
   */
  updateLocation(position: MapPosition, zoom: number = 15, markerTitle: string = 'Location'): void {
    this.panTo(position, zoom);
    this.addMarker(position, markerTitle);
  }

  /**
   * Reverse geocode a position to get address
   */
  async reverseGeocode(position: MapPosition): Promise<string | null> {
    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          resolve(results[0].formatted_address);
        } else {
          console.warn('Reverse geocoding failed:', status);
          resolve(null);
        }
      });
    });
  }

  /**
   * Extract position from map click event
   */
  extractPositionFromEvent(event: google.maps.MapMouseEvent): MapPosition | null {
    if (!event.latLng) return null;

    return {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
  }

  /**
   * Get the current map instance
   */
  getMap(): google.maps.Map | null {
    return this.map;
  }

  /**
   * Get the current marker
   */
  getCurrentMarker(): google.maps.marker.AdvancedMarkerElement | null {
    return this.currentMarker;
  }

  /**
   * Clean up all resources
   */
  cleanup(): void {
    this.removeMarker();
    
    if (this.placeAutocomplete) {
      this.placeAutocomplete.remove();
      this.placeAutocomplete = null;
    }
    
    this.map = null;
    this.isMapReady.set(false);
  }
}
