import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AddWorkoutPage } from '../add-workout/add-workout.page';

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
export class WorkoutPlansPage implements OnInit {

  searchQuery: string = '';
  myPlansOnly: boolean = false;
  expandedIndex: number | null = 2; // Card 3 expanded by default

  workoutPlans: WorkoutPlan[] = [
    {
      id: 1,
      name: 'Beginner weight loss program..',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      isCopyable: false,
      isSystemPlan: true,
      isUserCreated: false,
      tags: ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg']
    },
    {
      id: 2,
      name: 'Beginner weight loss program..',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      isCopyable: true,
      isSystemPlan: true,
      isUserCreated: false,
      tags: ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg']
    },
    {
      id: 3,
      name: 'Beginner weight loss program..',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium tellus quis arcu mollis, in sodales dui volutpat.',
      isCopyable: false,
      isSystemPlan: true,
      isUserCreated: false,
      tags: ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg']
    },
    {
      id: 4,
      name: 'Beginner weight loss program..',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      isCopyable: false,
      isSystemPlan: true,
      isUserCreated: false,
      tags: ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg']
    },
    {
      id: 5,
      name: 'Beginner weight loss program..',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      isCopyable: true,
      isSystemPlan: true,
      isUserCreated: false,
      tags: ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg']
    },
    {
      id: 6,
      name: 'Beginner weight loss program..',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      isCopyable: false,
      isSystemPlan: true,
      isUserCreated: false,
      tags: ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg']
    }
  ];

  filteredPlans: WorkoutPlan[] = [];

  constructor(
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.filterPlans();
  }

  filterPlans(): void {
    const search = this.searchQuery.trim().toLowerCase();

    this.filteredPlans = this.workoutPlans.filter(plan => {
      const matchesSearch =
        plan.name.toLowerCase().includes(search) ||
        plan.description.toLowerCase().includes(search) ||
        plan.tags.some(tag => tag.toLowerCase().includes(search));

      const matchesToggle = this.myPlansOnly ? plan.isUserCreated === true : true;

      return matchesSearch && matchesToggle;
    });
  }

  async openAddWorkoutModal() {
    const modal = await this.modalController.create({
      component: AddWorkoutPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 1,
      breakpoints: [0, 0.92, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        editingPlan: null // Passes null so the form opens empty
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      const newPlan: WorkoutPlan = {
        id: 'plan_' + Date.now(),
        name: data.name || 'New Workout Plan',
        description: data.description || '',
        tags: data.tags || [],
        isCopyable: true,
        isSystemPlan: false,
        isUserCreated: true
      };

      this.workoutPlans.unshift(newPlan);
      this.filterPlans();

      const toast = await this.toastController.create({
        message: 'Workout Plan Added Successfully',
        duration: 1800,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    }
  }

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
        editingPlan: plan // Pass existing plan to populate modal for editing
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      const index = this.workoutPlans.findIndex(p => p.id === data.id);
      if (index !== -1) {
        this.workoutPlans[index] = {
          ...this.workoutPlans[index],
          name: data.name,
          description: data.description,
          tags: data.tags
        };
      }
      this.filterPlans();

      const toast = await this.toastController.create({
        message: 'Workout Plan Updated Successfully',
        duration: 1800,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    }
  }

  async copyPlan(plan: WorkoutPlan, event: Event) {
    event.stopPropagation();

    const duplicatedPlan: WorkoutPlan = {
      ...plan,
      id: 'plan_' + Date.now(),
      name: `${plan.name} (Copy)`,
      isUserCreated: true,
      isSystemPlan: false,
      isCopyable: true
    };

    this.workoutPlans.unshift(duplicatedPlan);
    this.filterPlans();

    const toast = await this.toastController.create({
      message: `${plan.name} copied successfully`,
      duration: 1800,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  async viewPlanDetails(plan: WorkoutPlan) {
    this.router.navigate(['/workout-details'], {
      queryParams: { id: plan.id }
    });
  }

  toggleExpand(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  navigateTab(path: string): void {
    this.router.navigate([path]);
  }
}