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
  GoogleMapsService,
  MapPosition,
} from '../../api/services/google-maps.service';

export interface LocationSelectedEvent {
  position: MapPosition;
  formattedAddress: string;
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
  height = input<string>('500px');
  markerTitle = input<string>('Location');

  // Outputs
  locationSelected = output<LocationSelectedEvent>();

  // State
  locationSearchControl = new FormControl('');
  locationSuggestions = signal<any[]>([]);
  center: google.maps.LatLngLiteral = this.googleMapsService.defaultCenter;
  zoom = this.googleMapsService.defaultZoom;
  mapOptions: google.maps.MapOptions = this.googleMapsService.defaultMapOptions;

  private geocoder: google.maps.Geocoder | null = null;

  ngOnInit(): void {
    // Set initial center if coordinates are provided
    if (this.initialLatitude() && this.initialLongitude()) {
      this.center = {
        lat: Number(this.initialLatitude()),
        lng: Number(this.initialLongitude()),
      };
      this.zoom = 15;
    }
  }

  ngOnDestroy(): void {
    this.googleMapsService.cleanup();
  }

  async onMapInitialized(map: google.maps.Map): Promise<void> {
    try {
      await this.googleMapsService.initializeMap(map);
      await this.initializeGeocoder();
      this.setupLocationSearch();
      this.addInitialMarker();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private async initializeGeocoder(): Promise<void> {
    try {
      this.geocoder = new google.maps.Geocoder();
    } catch (error) {
      console.error('Error initializing geocoder:', error);
    }
  }

  private setupLocationSearch(): void {
    this.locationSearchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((value) => {
        if (value && value.length > 2) {
          this.searchLocations(value);
        } else {
          this.locationSuggestions.set([]);
        }
      });
  }

  private searchLocations(query: string): void {
    if (!this.geocoder) return;

    this.geocoder.geocode(
      {
        address: query,
        region: 'ge',
        componentRestrictions: { country: 'ge' },
      },
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results) {
          const predictions = results.slice(0, 8).map((result) => ({
            description: result.formatted_address || '',
            place_id: result.place_id || '',
            structured_formatting: {
              main_text: this.extractMainText(result),
              secondary_text: result.formatted_address || '',
            },
            geometry: result.geometry,
          }));
          this.locationSuggestions.set(predictions);
        } else {
          this.locationSuggestions.set([]);
        }
      },
    );
  }

  private extractMainText(result: google.maps.GeocoderResult): string {
    const addressComponents = result.address_components || [];
    const streetNumber = addressComponents.find((c) =>
      c.types.includes('street_number'),
    );
    const route = addressComponents.find((c) => c.types.includes('route'));
    const locality = addressComponents.find((c) =>
      c.types.includes('locality'),
    );

    if (streetNumber && route) {
      return `${streetNumber.long_name} ${route.long_name}`;
    } else if (route) {
      return route.long_name;
    } else if (locality) {
      return locality.long_name;
    }
    return result.formatted_address?.split(',')[0] || '';
  }

  onLocationSelected(prediction: any): void {
    if (!prediction.geometry || !prediction.geometry.location) return;

    this.locationSearchControl.setValue(prediction.description, {
      emitEvent: false,
    });

    const position: MapPosition = {
      lat: prediction.geometry.location.lat(),
      lng: prediction.geometry.location.lng(),
    };

    this.handleLocationSelect(position, prediction.description || '');
  }

  displayLocationFn(prediction: any): string {
    return prediction ? prediction.description : '';
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    const position = this.googleMapsService.extractPositionFromEvent(event);
    if (!position) return;

    this.googleMapsService.addMarker(position, this.markerTitle());
    this.reverseGeocodeAndEmit(position);
  }

  private handleLocationSelect(
    position: MapPosition,
    formattedAddress: string,
  ): void {
    this.updateMapLocation(position, 15);
    this.locationSelected.emit({ position, formattedAddress });
  }

  private addInitialMarker(): void {
    if (this.initialLatitude() && this.initialLongitude()) {
      const position: MapPosition = {
        lat: Number(this.initialLatitude()),
        lng: Number(this.initialLongitude()),
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
    const address = await this.googleMapsService.reverseGeocode(position);
    if (address) {
      this.locationSelected.emit({ position, formattedAddress: address });
    } else {
      this.locationSelected.emit({ position, formattedAddress: '' });
    }
  }
}
