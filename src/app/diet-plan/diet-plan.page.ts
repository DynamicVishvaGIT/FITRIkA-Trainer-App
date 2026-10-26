
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';

import { AddDietPlanPage } from '../add-diet-plan/add-diet-plan.page';
import { Common } from '../common';
import { Api } from '../api';

export interface DietPlanItem {
  id: string;
  name: string;
  description: string;
  isSystemPlan: boolean;
  isUserCreated: boolean;
  isCopyable?: boolean;
  tags: string[];
  isExpanded: boolean;
}

@Component({
  selector: 'app-diet-plan',
  templateUrl: './diet-plan.page.html',
  styleUrls: ['./diet-plan.page.scss'],
  standalone: false,
})
export class DietPlanPage implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();
  private searchTimer: ReturnType<typeof setTimeout> | undefined;

  searchQuery = '';
  isMyPlansOnly = false;

  page = 1;
  pageSize = 20;

  masterDietPlans: DietPlanItem[] = [];
  filteredPlans: DietPlanItem[] = [];

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private commonService: Common,
    private apiService: Api
  ) {}

  ngOnInit(): void {}

  // Reload the list whenever the page becomes active.
  ionViewWillEnter(): void {
    this.diet_plan_list(true);
  }

  ngOnDestroy(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  // ---------- Diet Plan List ----------
  diet_plan_list(showLoader = false): void {
    const listData = {
      search: this.searchQuery.trim(),
      my_plans: this.isMyPlansOnly,
      page: this.page,
      page_size: this.pageSize,
    };

    console.log('Diet plan list request:', listData);

    if (showLoader) {
      this.commonService.presentLoading();
    }

    this.apiService
      .diet_plan_list(listData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (showLoader) {
            this.commonService.dismissLoading();
          }

          console.log('Diet plan list response:', response);

          const list: any[] =
            response?.data ??
            response?.diet_plans ??
            response?.plans ??
            [];

          const expandedIds = this.filteredPlans
            .filter((plan) => plan.isExpanded)
            .map((plan) => plan.id);

          this.masterDietPlans = list.map((item) =>
            this.mapPlan(item, expandedIds)
          );

          this.filteredPlans = [...this.masterDietPlans];
        },
        error: (error: any) => {
          if (showLoader) {
            this.commonService.dismissLoading();
          }

          console.error('Diet plan list error:', error);

          this.commonService.showToastMessage(
            error?.error?.message ||
              error?.message ||
              'Unable to load diet plans.',
            'toast-error',
            '',
            4000
          );
        },
      });
  }

  // ---------- Map API Response ----------
  private mapPlan(
    item: any,
    expandedIds: string[]
  ): DietPlanItem {
    const isSystem =
      item.is_system_plan ??
      item.is_system ??
      item.system_plan ??
      false;

    const isUser =
      item.is_user_created ??
      item.is_mine ??
      item.my_plan ??
      !isSystem;

    const id = String(item.diet_plan_id ?? item.id ?? '');

    return {
      id,
      name: item.name ?? '',
      description: item.description ?? '',
      tags: Array.isArray(item.tags) ? item.tags : [],
      isSystemPlan: Boolean(isSystem),
      isUserCreated: Boolean(isUser),
      isCopyable: item.is_copyable ?? Boolean(isSystem),
      isExpanded: expandedIds.includes(id),
    };
  }

  // ---------- Search and My Plans Filter ----------
  filterDietPlans(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.page = 1;
      this.diet_plan_list(false);
    }, 400);
  }

  // ---------- Expand / Collapse ----------
  toggleCardExpansion(index: number): void {
    const plan = this.filteredPlans[index];

    if (plan) {
      plan.isExpanded = !plan.isExpanded;
    }
  }

  // ---------- Navigate to Details ----------
  navigateToDetails(plan: DietPlanItem): void {
    this.router.navigate(['/diet-plan-details'], {
      queryParams: { id: plan.id },
    });
  }

  // ---------- Duplicate Confirmation Alert ----------
  async confirmDuplicatePlan(
    plan: DietPlanItem,
    event: Event
  ): Promise<void> {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: 'Duplicate Plan',
      message: `Are you sure you want to duplicate "${plan.name}"?`,
      cssClass: 'duplicate-confirm-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'dup-btn-cancel',
        },
        {
          text: 'Confirm',
          role: 'confirm',
          cssClass: 'dup-btn-confirm',
          handler: () => {
            this.duplicatePlan(plan);
          },
        },
      ],
    });

    await alert.present();
  }

  // ---------- Duplicate Diet Plan API ----------
  private duplicatePlan(plan: DietPlanItem): void {
    const duplicateData = {
      diet_plan_id: plan.id,
    };

    console.log('Duplicate diet plan request:', duplicateData);

    this.commonService.presentLoading();

    this.apiService
      .duplicate_diet_plan(duplicateData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          this.commonService.dismissLoading();

          console.log('Duplicate diet plan response:', response);

          this.commonService.showToastMessage(
            response?.message ||
              `${plan.name} copied successfully`,
            'toast-success',
            '',
            2000
          );

          this.diet_plan_list(false);
        },
        error: (error: any) => {
          this.commonService.dismissLoading();

          console.error('Duplicate diet plan error:', error);

          this.commonService.showToastMessage(
            error?.error?.message ||
              error?.message ||
              'Unable to duplicate diet plan. Please try again.',
            'toast-error',
            '',
            4000
          );
        },
      });
  }

  // ---------- Delete Confirmation ----------
  async confirmDeletePlan(plan: DietPlanItem): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete Diet Plan',
      message: `Are you sure you want to delete "${plan.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.delete_diet_plan(plan);
          },
        },
      ],
    });

    await alert.present();
  }

  // ---------- Delete Diet Plan API ----------
  delete_diet_plan(plan: DietPlanItem): void {
    const deleteData = {
      diet_plan_id: plan.id,
    };

    console.log('Delete diet plan request:', deleteData);

    this.commonService.presentLoading();

    this.apiService
      .delete_diet_plan(deleteData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          this.commonService.dismissLoading();

          console.log('Delete diet plan response:', response);

          this.commonService.showToastMessage(
            response?.message ||
              'Diet plan deleted successfully',
            'toast-success',
            '',
            2000
          );

          this.diet_plan_list(false);
        },
        error: (error: any) => {
          this.commonService.dismissLoading();

          console.error('Delete diet plan error:', error);

          this.commonService.showToastMessage(
            error?.error?.message ||
              error?.message ||
              'Unable to delete diet plan.',
            'toast-error',
            '',
            4000
          );
        },
      });
  }

  // ---------- Add Diet Plan Modal ----------
  async openAddDietPlanModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddDietPlanPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 1,
      breakpoints: [0, 0.92, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        editingPlan: null,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.diet_plan_list(true);
    }
  }

  // ---------- Edit Diet Plan Modal ----------
  async editDietPlan(
    plan: DietPlanItem,
    event?: Event
  ): Promise<void> {
    event?.stopPropagation();

    const modal = await this.modalController.create({
      component: AddDietPlanPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 1,
      breakpoints: [0, 0.92, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        editingPlan: plan,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.diet_plan_list(true);
    }
  }
}
