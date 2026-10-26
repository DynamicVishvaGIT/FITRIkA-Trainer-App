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
  standalone: false,
})
export class WorkoutPlanDetailPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  dayId: string | null = null;
  workoutPlanId: string | null = null;
  systemFlag: string | null = null;

  dayTitle: string = '';
  isRestDay: boolean = false;
  exercisesList: ExerciseItem[] = [];

  // In-app video player
  isVideoOpen: boolean = false;
  isYoutubeVideo: boolean = false;
  youtubeEmbedUrl: SafeResourceUrl | null = null;
  videoFileUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private commonService: Common,
    private apiService: Api
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    const q = this.route.snapshot.queryParamMap;
    this.dayId = q.get('day_id');
    this.workoutPlanId = q.get('workout_plan_id');
    this.systemFlag = q.get('system');
    console.log('Day id:', this.dayId);
  }

  ionViewWillEnter() {
    if (this.dayId) {
      this.day_plan_details(true);
    } else {
      this.commonService.showToastMessage('Day id missing. Please try again.', 'toast-error', '', 2000);
    }
  }

  // Stops the video when leaving the page
  ionViewWillLeave() {
    this.closeVideo();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // ---------- day_plan_details ----------
  day_plan_details(showLoader: boolean = false) {
    let detailsData: any = {};
    detailsData.day_id = this.dayId;
    console.log(detailsData);

    if (showLoader) {
      this.commonService.presentLoading();
    }

    this.apiService.day_plan_details(detailsData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      if (showLoader) {
        this.commonService.dismissLoading();
      }

      const day: any = response?.data || response?.day || response?.day_plan || response;

      this.dayTitle = day?.name || day?.title || '';
      this.isRestDay = !!day?.is_rest_day;

      const list: any[] = day?.exercises || day?.day_exercises || [];
      this.exercisesList = list.map((e: any) => this.mapExercise(e));
    },
    respError => {
      console.log(respError);
      if (showLoader) {
        this.commonService.dismissLoading();
      }
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // YouTube id from watch, youtu.be, embed and shorts links
  private youtubeId(url: string | null): string | null {
    if (!url) { return null; }
    const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  private mapExercise(e: any): ExerciseItem {
    const video: string | null = e.video_link || e.video_url || e.video || null;
    const ytId = this.youtubeId(video);
    const isYoutube = !!ytId;

    return {
      dayExerciseId: e.id ?? e.day_exercise_id,
      exerciseId: e.exercise_id ?? e.exercise?.id,
      name: e.exercise_name || e.name || e.exercise?.name || '',
      isExpanded: true,
      equipment: e.equipment || '',
      muscleGroup: e.muscle_group || '',
      videoUrl: video,
      videoLink: isYoutube ? (video as string) : '',
      videoAttachedPath: video && !isYoutube ? video : null,
      thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : (e.thumbnail || null),
      sets: (e.sets || []).map((s: any) => ({
        intensity: s.intensity_kg ?? s.intensity ?? null,
        reps: s.reps ?? null,
        tempo: s.tempo || ''
      }))
    };
  }

  goBack() {
    if (this.workoutPlanId) {
      const params: any = { id: this.workoutPlanId };
      if (this.systemFlag) { params.system = this.systemFlag; }
      this.router.navigate(['/workout-details'], { queryParams: params });
    } else {
      this.router.navigate(['/workout-plans']);
    }
  }

  toggleExercise(index: number) {
    this.exercisesList[index].isExpanded = !this.exercisesList[index].isExpanded;
  }

  // ---------- update_day_plan (API is called inside the modal) ----------
  async editExercise(index: number) {
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
        initialExercisesList: JSON.parse(JSON.stringify(this.exercisesList)),
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
  playVideo(videoPath: string | null) {
    if (!videoPath) { return; }

    const ytId = this.youtubeId(videoPath);
    if (ytId) {
      this.isYoutubeVideo = true;
      this.videoFileUrl = null;
      this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1&rel=0`
      );
    } else {
      this.isYoutubeVideo = false;
      this.youtubeEmbedUrl = null;
      this.videoFileUrl = videoPath;
    }
    this.isVideoOpen = true;
  }

  closeVideo() {
    // Removing the player from the page stops the sound immediately
    this.isVideoOpen = false;
    this.youtubeEmbedUrl = null;
    this.videoFileUrl = null;
    this.isYoutubeVideo = false;
  }
}