import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { ProjectResponseInterface } from '../../api/interfaces';
import { ProjectCard } from '../project-card/project-card';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  configureLeafletDefaults,
  createOpenStreetMapLayer,
  invalidateMapSize,
} from '../../shared/utils/leaflet-defaults.util';

interface ProjectMarker {
  project: ProjectResponseInterface;
  position: {
    lat: number;
    lng: number;
  };
}

@Component({
  selector: 'app-projects-map',
  imports: [ProjectCard],
  templateUrl: './projects-map.html',
  styleUrl: './projects-map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsMap implements AfterViewInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly router = inject(Router);

  projects = input.required<ProjectResponseInterface[]>();
  projectClick = output<ProjectResponseInterface>();

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLElement>;

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

  readonly hoveredProject = signal<ProjectResponseInterface | null>(null);
  readonly hoverCardPosition = signal<{ x: number; y: number } | null>(null);
  readonly hoverCardVisible = signal(false);

  private readonly mapReady = signal(false);
  private map: L.Map | null = null;
  private markersLayer = L.layerGroup();
  private activeMarkerLatLng: L.LatLng | null = null;
  private hideCardTimeout: ReturnType<typeof setTimeout> | null = null;
  private showCardTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly hoverCardLeaveDurationMs = 200;

  constructor() {
    effect(() => {
      if (!this.mapReady()) {
        return;
      }

      this.renderMarkers(this.markers());
    });
  }

  ngAfterViewInit(): void {
    configureLeafletDefaults();
    this.initializeMap();
    this.mapReady.set(true);
  }

  ngOnDestroy(): void {
    this.clearHideTimeout();
    this.clearShowTimeout();
    this.map?.remove();
    this.map = null;
  }

  onHoverCardEnter(): void {
    this.clearHideTimeout();
  }

  onHoverCardLeave(): void {
    this.scheduleHideHoverCard();
  }

  onHoverCardClick(project: ProjectResponseInterface, event: MouseEvent): void {
    event.stopPropagation();
    this.projectClick.emit(project);
    this.router.navigate(['/projects', project.id]);
  }

  private initializeMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
    });

    createOpenStreetMapLayer().addTo(this.map);
    this.markersLayer.addTo(this.map);

    this.map.on('move zoom', () => this.updateHoverCardPosition());
    invalidateMapSize(this.map);
  }

  private renderMarkers(markers: ProjectMarker[]): void {
    if (!this.map) {
      return;
    }

    this.clearHoverCard();
    this.markersLayer.clearLayers();

    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.position.lat, marker.position.lng], {
        title: marker.project.name,
      })
        .on('click', () => {
          this.ngZone.run(() => this.projectClick.emit(marker.project));
        })
        .on('mouseover', () => this.showHoverCard(marker, leafletMarker))
        .on('mouseout', () => this.scheduleHideHoverCard());

      leafletMarker.addTo(this.markersLayer);
    });

    if (markers.length === 1) {
      this.map.setView([markers[0].position.lat, markers[0].position.lng], 14);
      return;
    }

    if (markers.length > 1) {
      const bounds = L.latLngBounds(
        markers.map(
          (marker) =>
            [marker.position.lat, marker.position.lng] as L.LatLngExpression,
        ),
      );
      this.map.fitBounds(bounds, { padding: [48, 48] });
    }
  }

  private showHoverCard(
    marker: ProjectMarker,
    leafletMarker: L.Marker,
  ): void {
    this.ngZone.run(() => {
      this.clearHideTimeout();
      this.clearShowTimeout();
      this.activeMarkerLatLng = leafletMarker.getLatLng();
      this.hoveredProject.set(marker.project);
      this.updateHoverCardPosition();
      this.hoverCardVisible.set(false);
    });

    // Defer the visible state so the card mounts at opacity 0 and the browser
    // can paint it before the transition runs. setTimeout is zone-patched, so
    // this reliably triggers change detection (unlike requestAnimationFrame).
    this.showCardTimeout = setTimeout(() => {
      this.hoverCardVisible.set(true);
    }, 30);
  }

  private scheduleHideHoverCard(): void {
    this.clearHideTimeout();
    this.clearShowTimeout();
    this.hoverCardVisible.set(false);

    this.hideCardTimeout = setTimeout(() => {
      this.clearHoverCard();
    }, this.hoverCardLeaveDurationMs);
  }

  private clearHideTimeout(): void {
    if (this.hideCardTimeout) {
      clearTimeout(this.hideCardTimeout);
      this.hideCardTimeout = null;
    }
  }

  private clearShowTimeout(): void {
    if (this.showCardTimeout) {
      clearTimeout(this.showCardTimeout);
      this.showCardTimeout = null;
    }
  }

  private clearHoverCard(): void {
    this.clearHideTimeout();
    this.clearShowTimeout();
    this.activeMarkerLatLng = null;
    this.hoveredProject.set(null);
    this.hoverCardPosition.set(null);
    this.hoverCardVisible.set(false);
  }

  private updateHoverCardPosition(): void {
    if (!this.map || !this.activeMarkerLatLng || !this.hoveredProject()) {
      return;
    }

    const point = this.map.latLngToContainerPoint(this.activeMarkerLatLng);
    this.hoverCardPosition.set({ x: point.x, y: point.y });
  }
}
