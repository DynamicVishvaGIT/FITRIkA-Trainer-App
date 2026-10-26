import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { AddWorkoutPage } from '../add-workout/add-workout.page';
import { Common } from '../common';
import { Api } from '../api';

export interface WorkoutPlan {
  id: number | string;
  name: string;
  description: string;
  isCopyable: boolean;
  isSystemPlan?: boolean;
  isUserCreated?: boolean;
  tags: string[];
}

@Component({
  selector: 'app-workout-plans',
  templateUrl: './workout-plans.page.html',
  styleUrls: ['./workout-plans.page.scss'],
  standalone: false,
})
export class WorkoutPlansPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;
  private searchTimer: any;

  searchQuery: string = '';
  myPlansOnly: boolean = false;
  expandedIndex: number | null = null;

  page: number = 1;
  pageSize: number = 20;

  workoutPlans: WorkoutPlan[] = [];
  filteredPlans: WorkoutPlan[] = [];

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private commonService: Common,
    private apiService: Api
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void { }

  // Reloads every time the user comes back to this page
  ionViewWillEnter() {
    this.workout_plan_list(true);
  }

  ngOnDestroy() {
    clearTimeout(this.searchTimer);
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // ---------- workout_plan_list ----------
  workout_plan_list(showLoader: boolean = false) {
    let listData: any = {};
    listData.search = this.searchQuery.trim();
    listData.my_plans = this.myPlansOnly;
    listData.page = this.page;
    listData.page_size = this.pageSize;
    console.log(listData);

    if (showLoader) {
      this.commonService.presentLoading();
    }

    this.apiService.workout_plan_list(listData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      if (showLoader) {
        this.commonService.dismissLoading();
      }
      // check the real key in Postman: data / workout_plans / plans
      const list: any[] = response?.data || response?.workout_plans || response?.plans || [];
      this.workoutPlans = list.map(item => this.mapPlan(item));
      this.filteredPlans = [...this.workoutPlans];
    },
    respError => {
      console.log(respError);
      if (showLoader) {
        this.commonService.dismissLoading();
      }
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // Converts one API item into the WorkoutPlan shape the HTML uses
  private mapPlan(item: any): WorkoutPlan {
    const isSystem = item.is_system_plan ?? item.is_system ?? item.system_plan ?? false;
    const isUser = item.is_user_created ?? item.is_mine ?? item.my_plan ?? !isSystem;
    return {
      id: item.workout_plan_id ?? item.id,
      name: item.name || '',
      description: item.description || '',
      tags: item.tags || [],
      isSystemPlan: !!isSystem,
      isUserCreated: !!isUser,
      // only system plans can be duplicated (Postman uses system_plan_id)
      isCopyable: item.is_copyable ?? !!isSystem
    };
  }

  // Search box + "My Plans" toggle both call this (HTML unchanged)
  filterPlans(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.page = 1;
      this.workout_plan_list(false);
    }, 400);
  }

  // ---------- add_workout_plan (inside the modal) ----------
  async openAddWorkoutModal() {
    const modal = await this.modalController.create({
      component: AddWorkoutPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 1,
      breakpoints: [0, 0.92, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        editingPlan: null // form opens empty
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    // The modal already called add_workout_plan and showed the toast
    if (data) {
      this.workout_plan_list(true);
    }
  }

  // ---------- update_workout_plan (inside the modal) ----------
  async editPlan(plan: WorkoutPlan, event: Event) {
    event.stopPropagation();

    const modal = await this.modalController.create({
      component: AddWorkoutPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 1,
      breakpoints: [0, 0.92, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        editingPlan: plan
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    // The modal already called update_workout_plan and showed the toast
    if (data) {
      this.workout_plan_list(true);
    }
  }

  // ---------- duplicate_workout_plan (with confirmation) ----------
  async copyPlan(plan: WorkoutPlan, event: Event) {
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: 'Duplicate Plan',
      message: `Are you sure you want to duplicate "${plan.name}"?`,
      cssClass: 'duplicate-confirm-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'dup-btn-cancel'
        },
        {
          text: 'Confirm',
          role: 'confirm',
          cssClass: 'dup-btn-confirm',
          handler: () => {
            this.duplicatePlan(plan);
          }
        }
      ]
    });

    await alert.present();
  }

  // Runs only after the user confirms
  private duplicatePlan(plan: WorkoutPlan) {
    let duplicateData: any = {};
    duplicateData.workout_plan_id = plan.id;
    console.log(duplicateData);

    this.commonService.presentLoading();
    this.apiService.duplicate_workout_plan(duplicateData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(
        response?.message || `${plan.name} copied successfully`, 'toast-success', '', 2000
      );
      this.workout_plan_list(false);
    },
    respError => {
      console.log(respError);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // ---------- details: opens the details page ----------
 async viewPlanDetails(plan: WorkoutPlan) {
  this.router.navigate(['/workout-details'], {
    queryParams: { id: plan.id, system: plan.isSystemPlan ? 'true' : 'false' }
  });
}

  toggleExpand(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  navigateTab(path: string): void {
    this.router.navigate([path]);
  }
}