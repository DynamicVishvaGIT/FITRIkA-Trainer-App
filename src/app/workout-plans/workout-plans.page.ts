import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AddWorkoutPage } from '../add-workout/add-workout.page';

// FIXED: Updated import statement with the new file path and component class name
// import { AddPlanComponent } from './components/add-plan.component'; 

@Component({
  selector: 'app-workout-plans',
  templateUrl: './workout-plans.page.html',
  styleUrls: ['./workout-plans.page.scss'],
  standalone: false,
})
export class WorkoutPlansPage implements OnInit {
  searchQuery: string = '';
  myPlansOnly: boolean = false;
  expandedIndex: number | null = 2;

  workoutPlans = [
    { name: 'Beginner weight loss program..', description: 'Lorem ipsum dolor sit amet.', isCopyable: false, tags: ['Fat loss', 'Beginner'] }
  ];

  filteredPlans: any[] = [];

  constructor(
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.filteredPlans = [...this.workoutPlans];
  }
  filterPlans() {
    this.filteredPlans = this.workoutPlans.filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            plan.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // Add your custom logic here if 'myPlansOnly' filters by an owner flag
      const matchesToggle = this.myPlansOnly ? true : true; 

      return matchesSearch && matchesToggle;
    });
  }

  /// 2. Handle view details navigation
  viewPlanDetails(plan: any) {
    console.log('Viewing plan details:', plan);
    // e.g., this.router.navigate(['/plan-details', plan.id]);
  }

  // 3. Handle copying a plan
  copyPlan(plan: any, event: Event) {
    event.stopPropagation(); // Prevents triggering viewPlanDetails on the parent container
    console.log('Copying plan:', plan);
  }

  // 4. Handle editing a plan
  editPlan(plan: any, event: Event) {
    event.stopPropagation(); // Prevents triggering viewPlanDetails on the parent container
    console.log('Editing plan:', plan);
  }

  // 5. Handle expanding/collapsing description text
  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  // 6. Handle bottom footer navigation
  navigateTab(path: string) {
    this.router.navigate([path]);
  }

  async openAddWorkoutModal() {
    const modal = await this.modalController.create({
      component: AddWorkoutPage, 
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 0.85,
      breakpoints: [0, 0.85, 1],
      handle: false
    });
    
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.router.navigate(['/details'], {
        queryParams: {
          name: data.name,
          description: data.description,
          tags: JSON.stringify(data.tags)
        }
      });
    }
  }
}