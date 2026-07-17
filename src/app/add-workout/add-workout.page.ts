import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-workout',
  templateUrl: './add-workout.page.html',
  styleUrls: ['./add-workout.page.scss'],
  standalone: false,
})
export class AddWorkoutPage implements OnInit {

  workoutName: string = '';
  description: string = '';
  
  
  // Default tags from Figma mock layout
  selectedTags: string[] = [];

  // Search Dropdown
  tagSearchQuery: string = '';
  isDropdownMenuVisible: boolean = false;

  masterDatasetTagOptions: string[] = [
    'Fat loss',
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
  ) {

    this.filteredTagOptions = [
      ...this.masterDatasetTagOptions
    ];

  }

  ngOnInit(): void {}

  // Close dropdown when clicked outside
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

  // Close Modal
  dismiss() {

    this.modalController.dismiss();

  }

  // Open Dropdown
  openDropdownMenu() {

    this.isDropdownMenuVisible = true;

    this.executeTagFiltering();

  }

  // Toggle Dropdown
  toggleDropdownMenu(event: Event) {

    event.stopPropagation();

    this.isDropdownMenuVisible =
      !this.isDropdownMenuVisible;

    if (this.isDropdownMenuVisible) {

      this.executeTagFiltering();

    }

  }

  // Search Filter
  executeTagFiltering() {

    const query =
      this.tagSearchQuery.toLowerCase().trim();

    this.filteredTagOptions =
      this.masterDatasetTagOptions.filter(tag => {

        const matches =
          tag.toLowerCase().includes(query);

        const alreadySelected =
          this.selectedTags.includes(tag);

        return matches && !alreadySelected;

      });

  }

  // Select Tag
   addNewTagToSelection(tag:string){

    if(tag && !this.selectedTags.includes(tag)){

        this.selectedTags=[
            ...this.selectedTags,
            tag
        ];

    }

    this.tagSearchQuery= tag;
    this.isDropdownMenuVisible=false;
    this.filteredTagOptions=[
   ...this.masterDatasetTagOptions
];
}

  // Remove Tag
  removeTag(tag: string) {

    this.selectedTags =
      this.selectedTags.filter(
        t => t !== tag
      );

    this.executeTagFiltering();

  }

  // Submit
  async submitAndProceed() {

    if (!this.workoutName.trim()) {

      const toast =
        await this.toastController.create({

          message: 'Please enter Workout Name',

          duration: 1800,

          color: 'warning',

          position: 'top'

        });

      await toast.present();

      return;

    }

    this.modalController.dismiss({

      name: this.workoutName,

      description: this.description,

      tags: this.selectedTags

    });

  }

}
