import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { ProjectResponseInterface } from '../../api/interfaces';

interface ProjectMarker {
  project: ProjectResponseInterface;
  position: google.maps.LatLngLiteral;
}

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
  lat: 41.7151,
  lng: 44.8271,
};

@Component({
  selector: 'app-projects-map',
  imports: [GoogleMapsModule],
  templateUrl: './projects-map.html',
  styleUrl: './projects-map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsMap {
  projects = input.required<ProjectResponseInterface[]>();
  projectClick = output<ProjectResponseInterface>();

  readonly center = DEFAULT_CENTER;
  readonly zoom = 11;
  readonly mapOptions: google.maps.MapOptions = {
    mapId: 'fccca69154ff5bebddfaa603',
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    clickableIcons: false,
  };

  readonly markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    gmpClickable: true,
  };

  readonly markers = computed<ProjectMarker[]>(() =>
    this.projects()
      .filter(
        (project) =>
          project.location?.latitude != null &&
          project.location?.longitude != null,
      )
      .map((project) => ({
        project,
        position: {
          lat: project.location.latitude,
          lng: project.location.longitude,
        },
      })),
  );

  private readonly map = signal<google.maps.Map | null>(null);

  constructor() {
    effect(() => {
      const map = this.map();
      const markers = this.markers();
      if (!map || markers.length === 0) return;

      if (markers.length === 1) {
        map.setCenter(markers[0].position);
        map.setZoom(14);
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(marker.position));
      map.fitBounds(bounds, 48);
    });
  }

  onMapInitialized(map: google.maps.Map): void {
    this.map.set(map);
  }

  onMarkerClick(marker: ProjectMarker): void {
    this.projectClick.emit(marker.project);
  }
}
