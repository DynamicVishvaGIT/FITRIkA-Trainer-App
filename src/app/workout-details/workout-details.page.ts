import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController, ModalController } from '@ionic/angular';
import { AddDayPlanPage } from '../add-day-plan/add-day-plan.page'; 
import { AddWorkoutPage } from '../add-workout/add-workout.page';

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.page.html',
  styleUrls: ['./workout-details.page.scss'],
  standalone: false,
})
export class WorkoutDetailsPage implements OnInit {

  planId: number | string | null = null;
  planName: string = 'Beginner weight loss program..';
  description: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium tellus quis arcu mollis, in sodales dui volutpat.';
  tags: string[] = ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg', 'gym', 'Low'];

  workoutDays = [
    { title: 'Upper Body', exerciseCount: 4, dayNumber: 'Day 1' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastController,
    private modalController: ModalController 
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.planId = params['id'];
      }
      if (params['name']) {
        this.planName = params['name'];
      }
      if (params['description']) {
        this.description = params['description'];
      }
      if (params['tags']) {
        try {
          this.tags = JSON.parse(params['tags']);
        } catch (e) {
          this.tags = ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg', 'gym', 'Low'];
        }
      }
    });
  }

  goBack() {
     this.router.navigate(['/workout-plans']);
  }

  // Matches the exact edit configuration and modal parameters used in workout-plans.page.ts
  async editWorkoutPlan(event: Event) {
    event.stopPropagation();

    const currentPlanObject = {
      id: this.planId || 1,
      name: this.planName,
      description: this.description,
      tags: this.tags,
      isCopyable: true
    };

    const modal = await this.modalController.create({
      component: AddWorkoutPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 1,
      breakpoints: [0, 0.92, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        editingPlan: currentPlanObject // Matches workout-plans page structure precisely
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.planName = data.name || 'New Workout Plan';
      this.description = data.description || '';
      this.tags = data.tags || [];

      const toast = await this.toastController.create({
        message: 'Workout Details Updated Successfully',
        duration: 1800,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    }
  }

  async addNewWorkoutDay() {
    const modal = await this.modalController.create({
      component: AddDayPlanPage,
      cssClass: 'add-day-modal-sheet', 
      initialBreakpoint: 0.92,       
      breakpoints: [0, 0.92, 1],
      handle: true
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    
    if (data) {
      const nextDayNum = this.workoutDays.length + 1;
      
      this.workoutDays.push({
        title: data.dayTitle || 'New Routine Split',
        exerciseCount: data.totalExercises || 0,
        dayNumber: `Day ${nextDayNum}`
      });

      const toast = await this.toastController.create({
        message: `Added Day ${nextDayNum} to plan configuration.`,
        duration: 1500,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  goToWorkoutPlanDetails() {
    this.router.navigate(['/workout-plan-detail']);
  }
}