import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AddWorkoutPage } from '../add-workout/add-workout.page';
import { AddDayPlanPage } from '../add-day-plan/add-day-plan.page';

interface WorkoutPlan {
  id: number;
  name: string;
  description: string;
  isCopyable: boolean;
  tags: string[];
}

@Component({
  selector: 'app-workout-plans',
  templateUrl: './workout-plans.page.html',
  styleUrls: ['./workout-plans.page.scss'],
  standalone: false,
})
export class WorkoutPlansPage implements OnInit {

  searchQuery: string = '';
  myPlansOnly: boolean = false;
  expandedIndex: number | null = null;

  workoutPlans: WorkoutPlan[] = [
    {
      id: 1,
      name: 'Beginner Weight Loss Program',
      description: 'A complete beginner workout plan for weight loss and overall fitness.',
      isCopyable: true,
      tags: ['Fat Loss', 'Beginner']
    },
    {
      id: 2,
      name: 'Muscle Building Plan',
      description: 'Strength training workout for intermediate gym members.',
      isCopyable: true,
      tags: ['Muscle Gain', 'Intermediate']
    },
    {
      id: 3,
      name: 'Cardio Blast',
      description: 'High intensity cardio sessions for endurance improvement.',
      isCopyable: false,
      tags: ['Cardio', 'Advanced']
    }
  ];

  filteredPlans: WorkoutPlan[] = [];

  constructor(
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.filteredPlans = [...this.workoutPlans];
  }

  // Opens AddWorkoutPage Sheet Overlay for fresh workflows
  async openAddWorkoutModal() {
    const modal = await this.modalController.create({
      component: AddWorkoutPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 1],
      backdropDismiss: true,
      handle: false
    });

    await modal.present();
  }

  // Search filter configuration mapping logic
  filterPlans(): void {
    const search = this.searchQuery.trim().toLowerCase();

    this.filteredPlans = this.workoutPlans.filter(plan => {
      const matchesSearch =
        plan.name.toLowerCase().includes(search) ||
        plan.description.toLowerCase().includes(search) ||
        plan.tags.some(tag => tag.toLowerCase().includes(search));

      const matchesToggle = this.myPlansOnly ? plan.isCopyable : true;

      return matchesSearch && matchesToggle;
    });
  }

  // View Routine Item details path router index
  async viewPlanDetails(plan: WorkoutPlan) {
    const toast = await this.toastController.create({
      message: `Opening ${plan.name}`,
      duration: 1200,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();

    this.router.navigate(['/workout-details'], {
      queryParams: { id: plan.id }
    });
  }

  // Duplicate an existing layout blueprint data package array structure
  async copyPlan(plan: WorkoutPlan, event: Event) {
    event.stopPropagation();
    const toast = await this.toastController.create({
      message: `${plan.name} copied successfully`,
      duration: 1200,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  // FIXED: Clicking the edit icon now launches the AddWorkoutPage modal sheet container instead of routing
  async editPlan(plan: WorkoutPlan, event: Event) {
    event.stopPropagation();

    const modal = await this.modalController.create({
      component: AddWorkoutPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        selectedPlan: plan,
        isEditMode: true
      }
    });

    await modal.present();
  }

  // Expand text window toggles dynamically
  toggleExpand(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  // Base footer tab dynamic router map link configuration
  navigateTab(path: string): void {
    this.router.navigate([path]);
  }

  // Day layout plan dynamic modal addition configurations 
  async openAddPlanModal() {
    const modal = await this.modalController.create({
      component: AddDayPlanPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 0.92,
      breakpoints: [0, 0.92, 1],
      handle: false
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      this.workoutPlans = [
        {
          id: this.workoutPlans.length + 1,
          name: data.name,
          description: data.description,
          tags: data.tags || [],
          isCopyable: true
        },
        ...this.workoutPlans
      ];

      this.filterPlans();

      const toast = await this.toastController.create({
        message: 'Workout Plan Added Successfully',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    }
  }
}