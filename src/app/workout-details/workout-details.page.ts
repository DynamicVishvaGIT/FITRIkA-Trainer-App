import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, NavController, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { AddDayPlanPage } from '../add-day-plan/add-day-plan.page';
import { AddWorkoutPage } from '../add-workout/add-workout.page';
import { Common } from '../common';
import { Api } from '../api';

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.page.html',
  styleUrls: ['./workout-details.page.scss'],
  standalone: false,
})
export class WorkoutDetailsPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  planId: number | string | null = null;
  planName: string = '';
  description: string = '';
  tags: string[] = [];

  workoutDays: { id: any; title: string; exerciseCount: number; dayNumber: string; isRestDay: boolean }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private modalController: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private commonService: Common,
    private apiService: Api
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    // The list page sends: /workout-details?id=...
    this.planId = this.route.snapshot.queryParamMap.get('id');
    console.log('Plan id:', this.planId);
  }

  // Runs on first open and every time the user comes back to this page
  ionViewWillEnter() {
    if (this.planId) {
      this.workout_plan_details(true);
    } else {
      this.commonService.showToastMessage('Plan id missing. Please try again.', 'toast-error', '', 2000);
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // ---------- workout_plan_details ----------
  workout_plan_details(showLoader: boolean = false) {
    let detailsData: any = {};
    detailsData.workout_plan_id = this.planId;
    console.log(detailsData);

    if (showLoader) {
      this.commonService.presentLoading();
    }

    this.apiService.workout_plan_details(detailsData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      if (showLoader) {
        this.commonService.dismissLoading();
      }

      const plan: any = response?.data || response?.workout_plan || response?.plan || response;

      this.planName = plan?.name || '';
      this.description = plan?.description || '';
      this.tags = plan?.tags || [];

      const days: any[] = plan?.days || plan?.workout_days || plan?.plan_days || [];
      this.workoutDays = days.map((d: any, index: number) => this.mapDay(d, index));
    },
    respError => {
      console.log(respError);
      if (showLoader) {
        this.commonService.dismissLoading();
      }
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // Converts one API day into the shape the HTML uses
  private mapDay(d: any, index: number) {
    const exercises = d.exercises || d.exercise_list || [];

    // Try the common names first
    let dayId = d.day_id ?? d.id ?? d.workout_day_id ?? d.plan_day_id ?? d.day_plan_id ?? d.dayId;

    // Otherwise use any field ending in "id", except the plan id and exercise ids
    if (dayId === undefined || dayId === null) {
      const key = Object.keys(d).find(k =>
        /id$/i.test(k) && !/^(workout_plan_id|plan_id|exercise_id)$/i.test(k)
      );
      if (key) {
        dayId = d[key];
      }
    }

    console.log('Day object keys:', Object.keys(d), '-> day id used:', dayId);

    return {
      id: dayId,
      title: d.title || d.name || d.day_title || 'Routine',
      exerciseCount: d.exercise_count ?? d.total_exercises ?? exercises.length ?? 0,
      dayNumber: d.day_label || (d.day_number ? `Day ${d.day_number}` : `Day ${index + 1}`),
      isRestDay: !!d.is_rest_day
    };
  }

  goBack() {
    this.router.navigate(['/workout-plans']);
  }

  // ---------- update_workout_plan (API is called inside the modal) ----------
  async editWorkoutPlan(event: Event) {
    event.stopPropagation();

    const currentPlanObject = {
      id: this.planId,
      workout_plan_id: this.planId,
      name: this.planName,
      description: this.description,
      tags: this.tags,
      isCopyable: true
    };

    const modal = await this.modalController.create({
      component: AddWorkoutPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 1,
      breakpoints: [0, 0.92, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        editingPlan: currentPlanObject
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    // The modal already called update_workout_plan and showed the toast
    if (data) {
      this.workout_plan_details(true);
    }
  }

  // ---------- add_day_plan (API is called inside the modal; rest day is a toggle there) ----------
  async addNewWorkoutDay() {
    const modal = await this.modalController.create({
      component: AddDayPlanPage,
      cssClass: 'add-day-modal-sheet',
      initialBreakpoint: 0.92,
      breakpoints: [0, 0.92, 1],
      handle: true,
      componentProps: {
        workoutPlanId: this.planId
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    // The modal already called add_day_plan and showed the toast
    if (data?.added) {
      this.workout_plan_details(true);
    }
  }

  // ---------- 3-dot menu on a day card ----------
  async openDayMenu(day: any, event: Event) {
    event.stopPropagation();

    const sheet = await this.actionSheetCtrl.create({
      header: day.title,
      buttons: [
        { text: 'Delete Day', role: 'destructive', handler: () => { this.confirmDeleteDay(day); } },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    await sheet.present();
  }

  async confirmDeleteDay(day: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Day',
      message: `Are you sure you want to delete "${day.title}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: () => { this.delete_day_plan(day); } }
      ]
    });
    await alert.present();
  }

  // ---------- delete_day_plan ----------
  delete_day_plan(day: any) {
    let deleteData: any = {};
    deleteData.day_id = day.id;
    console.log(deleteData);

    this.commonService.presentLoading();
    this.apiService.delete_day_plan(deleteData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(response?.message || 'Day deleted successfully', 'toast-success', '', 2000);
      this.workout_plan_details(false);
    },
    respError => {
      console.log(respError);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // Opens the day page (day_plan_details is called there)
  goToWorkoutPlanDetails(day?: any) {
    console.log('Tapped day:', day);
    if (!day || day.id === undefined || day.id === null) {
      this.commonService.showToastMessage('Day id not found in the plan details response.', 'toast-error', '', 3000);
      return;
    }
    this.router.navigate(['/workout-plan-detail'], {
      queryParams: { day_id: day.id, workout_plan_id: this.planId }
    });
  }
}