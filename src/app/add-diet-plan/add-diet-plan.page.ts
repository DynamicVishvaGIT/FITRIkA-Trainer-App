import { Component, OnDestroy, OnInit, HostListener, ElementRef, Input } from '@angular/core';
import { DietPlanItem } from '../diet-plan/diet-plan.page';
import { ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { Common } from '../common';
import { Api } from '../api';

@Component({
  selector: 'app-add-diet-plan',
  templateUrl: './add-diet-plan.page.html',
  styleUrls: ['./add-diet-plan.page.scss'],
  standalone: false,
})
export class AddDietPlanPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  @Input() editingPlan: DietPlanItem | null = null;

  isEditing: boolean = false;
  editingPlanId: string | null = null;
  isSubmitting: boolean = false;

  planName: string = '';
  planDescription: string = '';

  selectedTags: string[] = [];
  tagSearchQuery: string = '';
  isDropdownMenuVisible: boolean = false;

  masterDatasetTagOptions: string[] = [
    'Fat loss',
    'Beginner',
    '4 weeks',
    'push, pull, leg',
    'Advanced Bodybuilding',
    'Keto Diet',
    '6 weeks plan',
    'Full Body Split'
  ];
  filteredTagOptions: string[] = [];

  constructor(
    private elementRef: ElementRef,
    private modalCtrl: ModalController,
    private commonService: Common,
    private apiService: Api
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.filteredTagOptions = [...this.masterDatasetTagOptions];

    if (this.editingPlan) {
      this.isEditing = true;
      this.editingPlanId = this.editingPlan.id;
      this.planName = this.editingPlan.name;
      this.planDescription = this.editingPlan.description;
      this.selectedTags = [...(this.editingPlan.tags || [])];

      if (this.selectedTags.length > 0) {
        this.tagSearchQuery = this.selectedTags[this.selectedTags.length - 1];
      }
    } else {
      this.resetForm();
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  resetForm() {
    this.isEditing = false;
    this.editingPlanId = null;
    this.planName = '';
    this.planDescription = '';
    this.selectedTags = [];
    this.tagSearchQuery = '';
  }

  @HostListener('document:click', ['$event'])
  interceptOutsideTaps(event: Event) {
    if (!this.elementRef.nativeElement.querySelector('.searchable-tags-dropdown-anchor')?.contains(event.target)) {
      this.isDropdownMenuVisible = false;
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss();
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
    const query = this.tagSearchQuery.toLowerCase();
    this.filteredTagOptions = this.masterDatasetTagOptions.filter(tag => {
      const match = tag.toLowerCase().includes(query);
      const alreadySelected = this.selectedTags.includes(tag);
      return match && !alreadySelected;
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

  removeTagFromSelection(tagToRemove: string) {
    this.selectedTags = this.selectedTags.filter(item => item !== tagToRemove);

    if (this.selectedTags.length > 0) {
      this.tagSearchQuery = this.selectedTags[this.selectedTags.length - 1];
    } else {
      this.tagSearchQuery = '';
    }
    this.executeTagFiltering();
  }

  handleFormSubmission() {
    if (!this.planName.trim()) {
      this.commonService.showToastMessage('Please fill out the Plan Name field.', 'toast-error', '', 2000);
      return;
    }
    if (this.isSubmitting) return;

    if (this.isEditing) {
      this.update_diet_plan();
    } else {
      this.add_diet_plan();
    }
  }

  // ---------- add_diet_plan ----------
  private add_diet_plan() {
    let addPlan: any = {};
    addPlan.name = this.planName.trim();
    addPlan.description = this.planDescription.trim();
    addPlan.tags = this.selectedTags;
    console.log(addPlan);

    this.isSubmitting = true;
    this.commonService.presentLoading();
    this.apiService.add_diet_plan(addPlan)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(response?.message || 'Diet plan added successfully', 'toast-success', '', 2000);
      this.modalCtrl.dismiss({ id: response?.diet_plan_id ?? response?.id ?? null, response: response });
    },
    respError => {
      this.onError(respError);
    });
  }

  // ---------- update_diet_plan ----------
  private update_diet_plan() {
    let updatePlan: any = {};
    updatePlan.diet_plan_id = this.editingPlanId;
    updatePlan.name = this.planName.trim();
    updatePlan.description = this.planDescription.trim();
    updatePlan.tags = this.selectedTags;
    console.log(updatePlan);

    this.isSubmitting = true;
    this.commonService.presentLoading();
    this.apiService.update_diet_plan(updatePlan)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(response?.message || 'Diet plan updated successfully', 'toast-success', '', 2000);
      this.modalCtrl.dismiss({ id: this.editingPlanId, response: response });
    },
    respError => {
      this.onError(respError);
    });
  }

  private onError(respError: any) {
    console.log(respError);
    this.isSubmitting = false;
    this.commonService.dismissLoading();
    this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
  }
}