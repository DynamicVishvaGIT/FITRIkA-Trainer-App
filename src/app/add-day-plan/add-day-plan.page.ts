import { Component, OnInit, Input } from '@angular/core';
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

  // Dynamic input configuration mapping hooks
  @Input() initialDayTitle: string = 'Upper Body';
  @Input() initialExercisesList: any[] = [];
  @Input() isEditMode: boolean = false;

  dayTitle = 'Upper Body';
  exercisesList: ExerciseBlockItem[] = [];

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

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    // Check if configuration parameters have incoming values loaded from existing records
    if (this.isEditMode && this.initialExercisesList && this.initialExercisesList.length > 0) {
      this.dayTitle = this.initialDayTitle;
      
      // Ensure missing data configurations are safely normalized into the active dataset form
      this.exercisesList = this.initialExercisesList.map(item => ({
        name: item.name || 'Incline Bench Press',
        isExpanded: item.isExpanded !== undefined ? item.isExpanded : true,
        equipment: item.equipment || '',
        muscleGroup: item.muscleGroup || '',
        videoAttachedPath: item.videoAttachedPath || null,
        sets: item.sets && item.sets.length > 0 ? item.sets.map((s: any) => ({
          intensity: s.intensity || null,
          reps: s.reps || null,
          tempo: s.tempo || item.tempo || '' // Handle minor variation updates cleanly
        })) : [{ intensity: null, reps: null, tempo: '' }]
      }));
    } else {
      this.initializeExercise();
    }
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
    this.exercisesList[index].isExpanded = !this.exercisesList[index].isExpanded;
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

  async triggerVideoAttachmentPlaceholder(exerciseIndex: number, setIndex: number) {
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

    // Dismiss passing the complete validated dataset structures upward into the listener component
    this.modalController.dismiss({
      dayTitle: this.dayTitle,
      totalExercises: this.exercisesList.length,
      exercisesData: this.exercisesList
    });
  }
}