import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AddDayPlanPage } from '../add-day-plan/add-day-plan.page';

interface WorkoutSet {
  intensity: number | null;
  reps: number | null;
  tempo?: string;
}

interface ExerciseItem {
  name: string;
  isExpanded: boolean;
  equipment: string;
  muscleGroup: string;
  tempo: string;
  videoAttachedPath: string | null;
  sets: WorkoutSet[];
}

@Component({
  selector: 'app-workout-plan-detail',
  templateUrl: './workout-plan-detail.page.html',
  styleUrls: ['./workout-plan-detail.page.scss'],
  standalone: false,
})
export class WorkoutPlanDetailPage implements OnInit {

  dayTitle = 'Upper Body';
  exercisesList: ExerciseItem[] = [];

  constructor(
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();

    if (nav?.extras?.state) {
      if (nav.extras.state['dayTitle']) {
        this.dayTitle = nav.extras.state['dayTitle'];
      }
      if (nav.extras.state['exercises']) {
        this.exercisesList = nav.extras.state['exercises'];
      }
    }

    // Fallback preview data matching template UI structure
    if (!this.exercisesList || this.exercisesList.length === 0) {
      this.exercisesList = [
        {
          name: 'Incline Dumbbell Press',
          isExpanded: true,
          equipment: 'Dumbbell',
          muscleGroup: 'Upper Chest',
          tempo: '-',
          videoAttachedPath: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
          sets: [
            { intensity: 10, reps: 20 },
            { intensity: 15, reps: 15 }
          ]
        },
        {
          name: 'Incline Dumbbell Press',
          isExpanded: true,
          equipment: 'Dumbbell',
          muscleGroup: 'Upper Chest',
          tempo: '-',
          videoAttachedPath: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
          sets: [
            { intensity: 10, reps: 20 },
            { intensity: 15, reps: 15 }
          ]
        }
      ];
    }
  }

  goBack() {
    this.router.navigate(['/workout-details']);
  }

  toggleExercise(index: number) {
    this.exercisesList[index].isExpanded = !this.exercisesList[index].isExpanded;
  }

  // FIXED: Standardizes page rendering into a perfectly anchored Ionic overlay container sheet
  async editExercise(index: number) {
    const modal = await this.modalController.create({
      component: AddDayPlanPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 1,
      breakpoints: [0, 0.92, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        initialDayTitle: this.dayTitle,
        // Send a deep cloned copy of current items to prevent unexpected structural mutation state leaks
        initialExercisesList: JSON.parse(JSON.stringify(this.exercisesList)),
        isEditMode: true
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    // Map structural changes safely back into view models if the data payload exists
    if (data) {
      this.dayTitle = data.dayTitle;
      this.exercisesList = data.exercisesData;

      const toast = await this.toastController.create({
        message: 'Day Plan Updated Successfully',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    }
  }

  deleteExercise(index: number) {
    this.exercisesList.splice(index, 1);
  }

  playVideo(videoPath: string | null) {
    if (videoPath) {
      window.open(videoPath, '_blank');
    }
  }
}