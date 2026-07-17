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

  // Current working template data sets
  planId: number | null = null;
  planName: string = 'Beginner weight loss program..';
  description: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium tellus quis arcu mollis, in sodales dui volutpat.';
  tags: string[] = ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg', 'gym', 'Low'];

  // Array storing row components
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
        this.planId = +params['id'];
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

  // FIXED: Launch AddWorkoutPage modal overlay on clicking edit icon instead of navigation
  async editWorkoutPlan(event: Event) {
    event.stopPropagation();

    const modal = await this.modalController.create({
      component: AddWorkoutPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        selectedPlan: {
          id: this.planId,
          name: this.planName,
          description: this.description,
          tags: this.tags,
          isCopyable: true
        },
        isEditMode: true
      }
    });

    await modal.present();
  }

  // Dynamic async engine to load the AddDayPlanPage sheet controller
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