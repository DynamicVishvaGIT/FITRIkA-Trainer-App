import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

export interface WorkoutSetInfo {
  intensity: number | null;
  reps: number | null;
  tempo: string;
}

export interface ExerciseBlockItem {
  name: string;
  isExpanded: boolean;

  equipment: string;
  muscleGroup: string;
  videoAttachedPath: string | null;

  sets: WorkoutSetInfo[];
}

@Component({
  selector: 'app-add-day-plan',
  templateUrl: './add-day-plan.page.html',
  styleUrls: ['./add-day-plan.page.scss'],
  standalone: false,
})
export class AddDayPlanPage implements OnInit {

  dayTitle = 'Upper Body';

  exerciseOptions: string[] = [
    'Incline Bench Press',
    'Flat Bench Press',
    'Decline Bench Press',
    'Shoulder Press',
    'Military Press',
    'Arnold Press',
    'Pull Up',
    'Lat Pulldown',
    'Cable Row',
    'Deadlift',
    'Squat',
    'Leg Press',
    'Leg Curl',
    'Leg Extension',
    'Biceps Curl',
    'Hammer Curl',
    'Triceps Pushdown'
  ];

  exercisesList: ExerciseBlockItem[] = [];

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.initializeExercise();
  }

  initializeExercise() {
    this.exercisesList = [
      {
        name: 'Incline Bench Press',
        isExpanded: true,

        equipment: '',
        muscleGroup: '',
        videoAttachedPath: null,

        sets: [
          {
            intensity: null,
            reps: null,
            tempo: ''
          }
        ]
      }
    ];
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  toggleExerciseExpand(index: number) {
    this.exercisesList[index].isExpanded =
      !this.exercisesList[index].isExpanded;
  }

  addNewExerciseNode() {

    this.exercisesList.push({

      name: 'Incline Bench Press',

      isExpanded: true,

      equipment: '',

      muscleGroup: '',

      videoAttachedPath: null,

      sets: [

        {

          intensity: null,

          reps: null,

          tempo: ''

        }

      ]

    });

  }

  removeExerciseNode(index: number) {

    this.exercisesList.splice(index, 1);

    if (this.exercisesList.length === 0) {

      this.addNewExerciseNode();

    }

  }

  updateSetsCount(exerciseIndex: number, change: number) {

    const currentSets = this.exercisesList[exerciseIndex].sets;

    if (change === 1) {

      currentSets.push({

        intensity: null,

        reps: null,

        tempo: ''

      });

    }

    if (change === -1 && currentSets.length > 1) {

      currentSets.pop();

    }

  }
async triggerVideoAttachmentPlaceholder(
  exerciseIndex: number,
  setIndex: number
) {

  const toast = await this.toastController.create({
    message: `Exercise ${exerciseIndex + 1} - Set ${setIndex + 1} Video`,
    duration: 1500,
    color: 'secondary',
    position: 'top'
  });

  await toast.present();

}

  async processFormSubmission() {

    if (!this.dayTitle.trim()) {

      const toast = await this.toastController.create({

        message: 'Please enter Day Title',

        duration: 1500,

        color: 'warning'

      });

      await toast.present();

      return;

    }

    this.modalController.dismiss({

      dayTitle: this.dayTitle,

      totalExercises: this.exercisesList.length,

      exercisesData: this.exercisesList

    });

  }

}