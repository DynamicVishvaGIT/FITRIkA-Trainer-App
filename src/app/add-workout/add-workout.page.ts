import { Component, ElementRef, HostListener, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { WorkoutPlan } from '../workout-plans/workout-plans.page';

@Component({
  selector: 'app-add-workout',
  templateUrl: './add-workout.page.html',
  styleUrls: ['./add-workout.page.scss'],
  standalone: false,
})
export class AddWorkoutPage implements OnInit {

  @Input() editingPlan: WorkoutPlan | null = null;

  isEditing: boolean = false;
  editingPlanId: number | string | null = null;

  workoutName: string = '';
  description: string = '';
  selectedTags: string[] = [];

  tagSearchQuery: string = '';
  isDropdownMenuVisible: boolean = false;

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
    private toastController: ToastController,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.filteredTagOptions = [...this.masterDatasetTagOptions];

    if (this.editingPlan) {
      this.isEditing = true;
      this.editingPlanId = this.editingPlan.id;
      this.workoutName = this.editingPlan.name;
      this.description = this.editingPlan.description;
      this.selectedTags = [...(this.editingPlan.tags || [])];
      
      if (this.selectedTags.length > 0) {
        this.tagSearchQuery = this.selectedTags[this.selectedTags.length - 1];
      }
    }
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

  async submitAndProceed() {
    if (!this.workoutName.trim()) {
      const toast = await this.toastController.create({
        message: 'Please enter Workout Name',
        duration: 1800,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }

    this.modalController.dismiss({
      id: this.editingPlanId,
      name: this.workoutName,
      description: this.description,
      tags: this.selectedTags
    });
  }
}