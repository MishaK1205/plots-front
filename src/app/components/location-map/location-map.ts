import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import * as L from 'leaflet';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import {
  GeocodingService,
  PlaceSuggestion,
} from '../../api/services/geocoding.service';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  configureLeafletDefaults,
  createOpenStreetMapLayer,
  invalidateMapSize,
} from '../../shared/utils/leaflet-defaults.util';

export interface LocationSelectedEvent {
  streetName: string;
  city: string;
  district: string;
  longitude: number;
  latitude: number;
}

@Component({
  selector: 'app-location-map',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  templateUrl: './location-map.html',
  styleUrl: './location-map.scss',
})
export class LocationMap implements AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly geocodingService = inject(GeocodingService);

  initialLatitude = input<number | null>(null);
  initialLongitude = input<number | null>(null);
  markerTitle = input<string>('Location');

  locationSelected = output<LocationSelectedEvent>();

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLElement>;

  locationSearchControl = new FormControl('');
  locationSuggestions = signal<PlaceSuggestion[]>([]);

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  ngAfterViewInit(): void {
    configureLeafletDefaults();
    this.initializeMap();
    this.setupLocationSearch();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
    this.marker = null;
  }

  onLocationSelected(suggestion: PlaceSuggestion): void {
    this.locationSearchControl.setValue(suggestion.description, {
      emitEvent: false,
    });
    this.locationSuggestions.set([]);
    this.handleLocationSelect(suggestion);
  }

  displayLocationFn(suggestion: PlaceSuggestion | string | null): string {
    if (!suggestion || typeof suggestion === 'string') {
      return suggestion ?? '';
    }

    return suggestion.description;
  }

  private initializeMap(): void {
    const lat = this.initialLatitude();
    const lng = this.initialLongitude();
    const hasInitialLocation = lat != null && lng != null;
    const center: L.LatLngExpression = hasInitialLocation
      ? [Number(lat), Number(lng)]
      : DEFAULT_MAP_CENTER;

    this.map = L.map(this.mapContainer.nativeElement, {
      center,
      zoom: hasInitialLocation ? 15 : DEFAULT_MAP_ZOOM,
    });

    createOpenStreetMapLayer().addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.setMarker(event.latlng.lat, event.latlng.lng);
      this.reverseGeocodeAndEmit(event.latlng.lat, event.latlng.lng);
    });

    if (hasInitialLocation) {
      this.setMarker(Number(lat), Number(lng));
    }

    invalidateMapSize(this.map);
  }

  private setupLocationSearch(): void {
    this.locationSearchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value || typeof value !== 'string' || value.length < 3) {
            this.locationSuggestions.set([]);
            return of<PlaceSuggestion[]>([]);
          }

          return this.geocodingService.searchPlaces(value);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((suggestions) => {
        this.locationSuggestions.set(suggestions);
      });
  }

  private handleLocationSelect(suggestion: PlaceSuggestion): void {
    this.updateMapLocation(suggestion.latitude, suggestion.longitude, 15);
    this.locationSelected.emit({
      streetName: suggestion.streetName,
      city: suggestion.city,
      district: suggestion.district,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
  }

  private setMarker(latitude: number, longitude: number): void {
    if (!this.map) {
      return;
    }

    if (this.marker) {
      this.marker.setLatLng([latitude, longitude]);
      return;
    }

    this.marker = L.marker([latitude, longitude], {
      title: this.markerTitle(),
    }).addTo(this.map);
  }

  private updateMapLocation(
    latitude: number,
    longitude: number,
    zoom: number,
  ): void {
    if (!this.map) {
      return;
    }

    this.map.setView([latitude, longitude], zoom);
    this.setMarker(latitude, longitude);
  }

  private reverseGeocodeAndEmit(latitude: number, longitude: number): void {
    this.geocodingService
      .reverseGeocode(latitude, longitude)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((address) => {
        this.locationSelected.emit({
          streetName: address.streetName,
          city: address.city,
          district: address.district,
          latitude,
          longitude,
        });
      });
  }
}
