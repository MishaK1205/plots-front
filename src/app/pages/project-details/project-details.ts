import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  AmenityResponseInterface,
  LandResponseInterface,
  ProjectFaqItem,
  ProjectResponseInterface,
} from '../../api/interfaces';
import {
  AmenitiesService,
  LandsService,
  ProjectsService,
} from '../../api/services';
import { LandCard, ProjectsMap } from '../../components';
import { LanguageStateService } from '../../shared/services/language-state.service';
import { localizeText } from '../../shared/utils/localize-text.util';
import { environment } from '../../../environments/environment';

const INITIAL_LANDS_COUNT = 3;

@Component({
  selector: 'app-project-details',
  imports: [LandCard, ProjectsMap],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetails implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly landsService = inject(LandsService);
  private readonly amenitiesService = inject(AmenitiesService);
  private readonly languageState = inject(LanguageStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef$ = inject(DestroyRef);

  project = signal<ProjectResponseInterface | null>(null);
  lands = signal<LandResponseInterface[]>([]);
  amenity = signal<AmenityResponseInterface | null>(null);

  showAllLands = signal(false);
  openFaqIndex = signal<number | null>(null);

  readonly coverImageUrl = computed(() => {
    const project = this.project();
    if (!project) return '';
    return this.resolveImageUrl(project.coverPhotoId ?? project.photoId);
  });

  readonly companyLogoUrl = computed(() =>
    this.resolveImageUrl(this.project()?.companyInfo?.logoId),
  );

  readonly companyName = computed(() =>
    this.localized(this.project()?.companyInfo?.companyName),
  );

  readonly tagline = computed(() => this.localized(this.project()?.tagline));

  readonly description = computed(() =>
    this.localized(this.project()?.description),
  );

  readonly minutesToLocation = computed(() =>
    this.localized(this.project()?.minutesToLocation),
  );

  readonly amenityName = computed(() =>
    this.localized(this.amenity()?.amenityName),
  );

  readonly visibleLands = computed(() =>
    this.showAllLands()
      ? this.lands()
      : this.lands().slice(0, INITIAL_LANDS_COUNT),
  );

  readonly hasMoreLands = computed(
    () => !this.showAllLands() && this.lands().length > INITIAL_LANDS_COUNT,
  );

  readonly faqItems = computed<ProjectFaqItem[]>(() => {
    const faq = this.project()?.faq;
    if (!faq) return [];
    return (
      faq[this.languageState.language()] ?? faq.geo ?? faq.eng ?? faq.rus ?? []
    );
  });

  readonly galleryUrls = computed(() =>
    (this.project()?.gallery ?? []).map((imageId) =>
      this.resolveImageUrl(imageId),
    ),
  );

  readonly mapProjects = computed(() => {
    const project = this.project();
    return project ? [project] : [];
  });

  readonly descriptionImageUrl = computed(() =>
    this.resolveImageUrl(this.project()?.photoId),
  );

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((params) => {
        const id = params.get('id');
        if (!id) return;
        this.showAllLands.set(false);
        this.openFaqIndex.set(null);
        this.loadProject(id);
        this.loadLands(id);
      });
  }

  toggleFaq(index: number): void {
    this.openFaqIndex.update((open) => (open === index ? null : index));
  }

  onContactClick(): void {
    const phone = this.project()?.companyInfo?.phone?.replace(/[^\d+]/g, '');
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  }

  private loadProject(id: string): void {
    this.projectsService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (project) => {
          this.project.set(project);
          this.loadAmenity(project.amenityId);
        },
        error: (error) => console.error('Error loading project:', error),
      });
  }

  private loadLands(projectId: string): void {
    this.landsService
      .getAll({ projectId, limit: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response) => this.lands.set(response.data),
        error: (error) => console.error('Error loading lands:', error),
      });
  }

  private loadAmenity(amenityId?: string): void {
    if (!amenityId) {
      this.amenity.set(null);
      return;
    }

    this.amenitiesService
      .getById(amenityId)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (amenity) => this.amenity.set(amenity),
        error: (error) => console.error('Error loading amenity:', error),
      });
  }

  private localized(
    value?: { geo: string; eng: string; rus: string } | null,
  ): string {
    return localizeText(value, this.languageState.language());
  }

  private resolveImageUrl(image?: string): string {
    if (!image) return '';
    return `${environment.apiUrl}/images/${image}`;
  }
}
