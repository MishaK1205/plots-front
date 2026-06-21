import * as L from 'leaflet';

export const DEFAULT_MAP_CENTER: L.LatLngExpression = [41.7151, 44.8271];
export const DEFAULT_MAP_ZOOM = 12;

let defaultsConfigured = false;

export function configureLeafletDefaults(): void {
  if (defaultsConfigured) {
    return;
  }

  defaultsConfigured = true;

  const iconDefault = L.icon({
    iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
    iconUrl: 'assets/leaflet/marker-icon.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });

  L.Marker.prototype.options.icon = iconDefault;
}

export function createOpenStreetMapLayer(): L.TileLayer {
  return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  });
}

export function invalidateMapSize(map: L.Map): void {
  setTimeout(() => map.invalidateSize(), 0);
}
