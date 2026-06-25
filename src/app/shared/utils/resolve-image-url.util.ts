import { environment } from '../../../environments/environment';

export function resolveImageUrl(image?: string | null): string {
  if (!image) return '';
  return `${environment.apiUrl}/images/${image}`;
}
