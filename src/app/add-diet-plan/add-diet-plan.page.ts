import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DietPlanItem } from '../diet-plan/diet-plan.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-diet-plan',
  templateUrl: './add-diet-plan.page.html',
  styleUrls: ['./add-diet-plan.page.scss'],
  standalone: false,
})
export class AddDietPlanPage implements OnInit {

  isEditing: boolean = false;
  editingPlanId: string | null = null;

  planName: string = '';
  planDescription: string = '';
  
  // Searchable dropdown state managers
  selectedTags: string[] = []; // Intentionally left empty at initialization per user requirements
  tagSearchQuery: string = '';
  isDropdownMenuVisible: boolean = false;
  
  masterDatasetTagOptions: string[] = ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg', 'Advanced Bodybuilding', 'Keto Diet', '6 weeks plan', 'Full Body Split'];
  filteredTagOptions: string[] = [];

  constructor(private router: Router, private elementRef: ElementRef, private modalCtrl: ModalController) {
    // Populate working array filter datasets initially
    this.filteredTagOptions = [...this.masterDatasetTagOptions];

    // Check for incoming editing states safely from the router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['editingPlan']) {
      const plan = navigation.extras.state['editingPlan'] as DietPlanItem;
      this.isEditing = true;
      this.editingPlanId = plan.id;
      this.planName = plan.name;
      this.planDescription = plan.description;
      this.selectedTags = [...plan.tags];
    }
  }

  ngOnInit() {}

  // Automatically close searchable layout if a user taps anywhere outside the component box element
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

  toggleDropdownMenu(event:Event){

   event.stopPropagation();

   this.isDropdownMenuVisible=!this.isDropdownMenuVisible;

   if(this.isDropdownMenuVisible){
      this.executeTagFiltering();
   }

}

  executeTagFiltering(){

 const query=this.tagSearchQuery.toLowerCase();

 this.filteredTagOptions=this.masterDatasetTagOptions.filter(tag=>{

   const match=tag.toLowerCase().includes(query);

   const alreadySelected=this.selectedTags.includes(tag);

   return match && !alreadySelected;

 });


  }

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

  removeTagFromSelection(tagToRemove: string) {
    this.selectedTags = this.selectedTags.filter(item => item !== tagToRemove);
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

    if (this.isEditing) {
      this.router.navigate(['/diet-plan'], { state: { updatedPlan: payloadData } });
    } else {
      this.router.navigate(['/diet-plan'], { state: { newPlan: payloadData } });
    }
  }
}