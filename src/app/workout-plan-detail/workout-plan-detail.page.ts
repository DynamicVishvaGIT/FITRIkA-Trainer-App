import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface WorkoutSet {
  intensity: number | null;
  reps: number | null;
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
    private router: Router
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

    // High fidelity default data fallback matching Figma image values
    if (!this.exercisesList || this.exercisesList.length === 0) {
      this.exercisesList = [
        {
          name: 'Incline Dumbbell Press',
          isExpanded: true,
          equipment: 'Dumbbell',
          muscleGroup: 'Upper Chest',
          tempo: '-',
          // Using a clean premium unsplash fitness link for fallback preview rendering
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

    this.exercisesList[index].isExpanded =
      !this.exercisesList[index].isExpanded;

  }

  editExercise(index: number) {

    this.router.navigate(
      ['/add-day-plan'],
      {
        state: {
          exercise: this.exercisesList[index],
          exerciseIndex: index
        }
      }
    );

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