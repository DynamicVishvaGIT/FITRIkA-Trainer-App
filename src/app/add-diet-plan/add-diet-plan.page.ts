import { Component, OnInit, HostListener, ElementRef, Input } from '@angular/core';
import { DietPlanItem } from '../diet-plan/diet-plan.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-diet-plan',
  templateUrl: './add-diet-plan.page.html',
  styleUrls: ['./add-diet-plan.page.scss'],
  standalone: false,
})
export class AddDietPlanPage implements OnInit {

  @Input() editingPlan: DietPlanItem | null = null;

  isEditing: boolean = false;
  editingPlanId: string | null = null;

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
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.filteredTagOptions = [...this.masterDatasetTagOptions];

    if (this.editingPlan) {
      this.isEditing = true;
      this.editingPlanId = this.editingPlan.id;
      this.planName = this.editingPlan.name;
      this.planDescription = this.editingPlan.description;
      this.selectedTags = [...(this.editingPlan.tags || [])];
      
      // Put the last tag into the input box if tags exist
      if (this.selectedTags.length > 0) {
        this.tagSearchQuery = this.selectedTags[this.selectedTags.length - 1];
      }
    } else {
      this.resetForm();
    }
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
    
    // Display the newly selected tag inside the input box
    this.tagSearchQuery = tag;
    this.isDropdownMenuVisible = false;
    this.executeTagFiltering();
  }

  removeTagFromSelection(tagToRemove: string) {
    this.selectedTags = this.selectedTags.filter(item => item !== tagToRemove);
    
    // Update input box value to the last available tag (or empty if none remain)
    if (this.selectedTags.length > 0) {
      this.tagSearchQuery = this.selectedTags[this.selectedTags.length - 1];
    } else {
      this.tagSearchQuery = '';
    }
    
    this.executeTagFiltering();
  }

  handleFormSubmission() {
    if (!this.planName.trim()) {
      alert('Please fill out the Plan Name field.');
      return;
    }

    const payloadData: DietPlanItem = {
      id: this.isEditing && this.editingPlanId ? this.editingPlanId : 'plan_' + Date.now(),
      name: this.planName,
      description: this.planDescription,
      isSystemPlan: false,
      isUserCreated: true,
      tags: this.selectedTags,
      isExpanded: false
    };

    this.modalCtrl.dismiss(payloadData);
  }
}