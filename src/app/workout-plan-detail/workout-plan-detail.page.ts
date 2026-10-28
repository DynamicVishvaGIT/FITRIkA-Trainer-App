
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { AddDayPlanPage } from '../add-day-plan/add-day-plan.page';
import { Common } from '../common';
import { Api } from '../api';

interface WorkoutSet {
  intensity: number | null;
  reps: number | null;
  tempo: string;
}

interface ExerciseItem {
  dayExerciseId: any;
  exerciseId: any;
  name: string;
  isExpanded: boolean;
  equipment: string;
  muscleGroup: string;
  videoUrl: string | null;
  videoLink: string;
  videoAttachedPath: string | null;
  thumbnail: string | null;
  sets: WorkoutSet[];
}

@Component({
  selector: 'app-workout-plan-detail',
  templateUrl: './workout-plan-detail.page.html',
  styleUrls: ['./workout-plan-detail.page.scss'],
  standalone: false
})
export class WorkoutPlanDetailPage implements OnInit, OnDestroy {

  private _unsubscribeAll = new Subject<void>();

  dayId: string | null = null;
  workoutPlanId: string | null = null;
  systemFlag: string | null = null;

  dayTitle = '';
  isRestDay = false;
  exercisesList: ExerciseItem[] = [];

  isVideoOpen = false;
  isYoutubeVideo = false;
  youtubeEmbedUrl: SafeResourceUrl | null = null;
  videoFileUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private commonService: Common,
    private apiService: Api
  ) {}

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    this.dayId = q.get('day_id');
    this.workoutPlanId = q.get('workout_plan_id');
    this.systemFlag = q.get('system');
  }

  ionViewWillEnter(): void {
    if (this.dayId) {
      this.day_plan_details(true);
    } else {
      this.commonService.showToastMessage(
        'Day id missing. Please try again.',
        'toast-error', '', 2000
      );
    }
  }

  ionViewWillLeave(): void {
    this.closeVideo();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // ---------- Day plan details ----------
  day_plan_details(showLoader = false): void {
    const detailsData = { day_id: this.dayId };

    if (showLoader) {
      this.commonService.presentLoading();
    }

    this.apiService.day_plan_details(detailsData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (showLoader) {
            this.commonService.dismissLoading();
          }

          const day = response?.data || response?.day ||
            response?.day_plan || response;

          this.dayTitle = day?.name || day?.title || '';
          this.isRestDay = !!day?.is_rest_day;

          const list: any[] = day?.exercises || day?.day_exercises || [];
          this.exercisesList = list.map(
            (exercise: any, index: number) =>
              this.mapExercise(exercise, index)
          );
        },
        error: (error: any) => {
          if (showLoader) {
            this.commonService.dismissLoading();
          }

          this.commonService.showToastMessage(
            error, 'toast-error', '', 4000
          );
        }
      });
  }

  // ---------- YouTube video ID ----------
  private youtubeId(url: string | null): string | null {
    if (!url) {
      return null;
    }

    const match = url.match(
      /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/
    );

    return match ? match[1] : null;
  }

  // ---------- Map exercise ----------
  private mapExercise(e: any, index: number): ExerciseItem {
    const video: string | null =
      e.video_link || e.video_url || e.video || null;

    const ytId = this.youtubeId(video);
    const isYoutube = !!ytId;

    return {
      dayExerciseId: e.id ?? e.day_exercise_id,
      exerciseId: e.exercise_id ?? e.exercise?.id,
      name: e.exercise_name || e.name || e.exercise?.name || '',

      // Only the first exercise is expanded initially.
      isExpanded: index === 0,

      equipment: e.equipment || '',
      muscleGroup: e.muscle_group || '',
      videoUrl: video,
      videoLink: isYoutube ? video! : '',
      videoAttachedPath: video && !isYoutube ? video : null,
      thumbnail: ytId
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : (e.thumbnail || null),

      sets: (e.sets || []).map((s: any) => ({
        intensity: s.intensity_kg ?? s.intensity ?? null,
        reps: s.reps ?? null,
        tempo: s.tempo || ''
      }))
    };
  }

  // ---------- Navigation ----------
  goBack(): void {
    if (this.workoutPlanId) {
      const params: any = { id: this.workoutPlanId };

      if (this.systemFlag) {
        params.system = this.systemFlag;
      }

      this.router.navigate(['/workout-details'], {
        queryParams: params
      });
    } else {
      this.router.navigate(['/workout-plans']);
    }
  }

  // ---------- Accordion ----------
  toggleExercise(index: number): void {
    const exercise = this.exercisesList[index];

    if (exercise) {
      exercise.isExpanded = !exercise.isExpanded;
    }
  }

  // ---------- Edit day plan ----------
  async editExercise(index: number): Promise<void> {
    const modal = await this.modalController.create({
      component: AddDayPlanPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 1,
      breakpoints: [0, 0.92, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        dayId: this.dayId,
        workoutPlanId: this.workoutPlanId,
        initialDayTitle: this.dayTitle,
        initialIsRestDay: this.isRestDay,
        initialExercisesList: JSON.parse(
          JSON.stringify(this.exercisesList)
        ),
        isEditMode: true
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.updated) {
      this.day_plan_details(true);
    }
  }

  // ---------- In-app video player ----------
  playVideo(videoPath: string | null): void {
    if (!videoPath) {
      return;
    }

    const ytId = this.youtubeId(videoPath);

    if (ytId) {
      this.isYoutubeVideo = true;
      this.videoFileUrl = null;

      this.youtubeEmbedUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1&rel=0`
        );
    } else {
      this.isYoutubeVideo = false;
      this.youtubeEmbedUrl = null;
      this.videoFileUrl = videoPath;
    }

    this.isVideoOpen = true;
  }

  closeVideo(): void {
    this.isVideoOpen = false;
    this.youtubeEmbedUrl = null;
    this.videoFileUrl = null;
    this.isYoutubeVideo = false;
  }
}
