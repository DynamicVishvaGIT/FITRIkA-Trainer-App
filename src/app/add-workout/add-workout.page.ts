import { Component, ElementRef, HostListener, OnDestroy, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { WorkoutPlan } from '../workout-plans/workout-plans.page';
import { Common } from '../common';
import { Api } from '../api';

@Component({
  selector: 'app-add-workout',
  templateUrl: './add-workout.page.html',
  styleUrls: ['./add-workout.page.scss'],
  standalone: false,
})
export class AddWorkoutPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  @Input() editingPlan: WorkoutPlan | null = null;

  isEditing: boolean = false;
  editingPlanId: number | string | null = null;

  workoutName: string = '';
  description: string = '';
  selectedTags: string[] = [];

  tagSearchQuery: string = '';
  isDropdownMenuVisible: boolean = false;

  isSubmitting: boolean = false;

  masterDatasetTagOptions: string[] = [
    'Fat Loss',
    'Beginner',
    '4 weeks',
    'Push, Pull, Leg',
    'Gym',
    'Low',
    'Muscle Gain',
    'Advanced',
    'Strength',
    'Cardio',
    'Endurance',
    'Weight Loss'
  ];

  filteredTagOptions: string[] = [];

  constructor(
    private modalController: ModalController,
    private elementRef: ElementRef,
    private commonService: Common,
    private apiService: Api
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.filteredTagOptions = [...this.masterDatasetTagOptions];

    if (this.editingPlan) {
      this.isEditing = true;
      // supports both key names (workout_plan_id or id)
      this.editingPlanId =
        (this.editingPlan as any).workout_plan_id ?? this.editingPlan.id;
      this.workoutName = this.editingPlan.name;
      this.description = this.editingPlan.description;
      this.selectedTags = [...(this.editingPlan.tags || [])];

      if (this.selectedTags.length > 0) {
        this.tagSearchQuery = this.selectedTags[this.selectedTags.length - 1];
      }
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (
      !this.elementRef.nativeElement
        .querySelector('.searchable-tags-dropdown-anchor')
        ?.contains(event.target)
    ) {
      this.isDropdownMenuVisible = false;
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  openDropdownMenu() {
    this.isDropdownMenuVisible = true;
    this.executeTagFiltering();
  }

  toggleDropdownMenu(event: Event) {
    event.stopPropagation();
    this.isDropdownMenuVisible = !this.isDropdownMenuVisible;
    if (this.isDropdownMenuVisible) {
      this.executeTagFiltering();
    }
  }

  executeTagFiltering() {
    const query = this.tagSearchQuery.toLowerCase().trim();
    this.filteredTagOptions = this.masterDatasetTagOptions.filter(tag => {
      const matches = tag.toLowerCase().includes(query);
      const alreadySelected = this.selectedTags.includes(tag);
      return matches && !alreadySelected;
    });
  }

  addNewTagToSelection(tag: string) {
    if (tag && !this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    }

    this.tagSearchQuery = tag;
    this.isDropdownMenuVisible = false;
    this.executeTagFiltering();
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    if (this.selectedTags.length > 0) {
      this.tagSearchQuery = this.selectedTags[this.selectedTags.length - 1];
    } else {
      this.tagSearchQuery = '';
    }
    this.executeTagFiltering();
  }

  submitAndProceed() {
    if (!this.workoutName.trim()) {
      this.commonService.showToastMessage('Please enter Workout Name', 'toast-error', '', 2000);
      return;
    }

    if (this.isSubmitting) return;

    if (this.isEditing) {
      this.update_workout_plan();
    } else {
      this.add_workout_plan();
    }
  }

  add_workout_plan() {
    let addPlan: any = {};
    addPlan.name = this.workoutName.trim();
    addPlan.description = this.description.trim();
    addPlan.tags = this.selectedTags;
    console.log(addPlan);

    this.isSubmitting = true;
    this.commonService.presentLoading();
    this.apiService.add_workout_plan(addPlan)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(
        response?.message || 'Workout plan added successfully', 'toast-success', '', 2000
      );
      this.modalController.dismiss({
        id: response?.workout_plan_id ?? response?.id ?? null,
        name: addPlan.name,
        description: addPlan.description,
        tags: addPlan.tags,
        response: response
      });
    },
    respError => {
      console.log(respError);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  update_workout_plan() {
    let updatePlan: any = {};
    updatePlan.workout_plan_id = this.editingPlanId;
    updatePlan.name = this.workoutName.trim();
    updatePlan.description = this.description.trim();
    updatePlan.tags = this.selectedTags;
    console.log(updatePlan);

    this.isSubmitting = true;
    this.commonService.presentLoading();
    this.apiService.update_workout_plan(updatePlan)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(
        response?.message || 'Workout plan updated successfully', 'toast-success', '', 2000
      );
      this.modalController.dismiss({
        id: this.editingPlanId,
        name: updatePlan.name,
        description: updatePlan.description,
        tags: updatePlan.tags,
        response: response
      });
    },
    respError => {
      console.log(respError);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }
}