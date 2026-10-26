import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { Common } from '../common';
import { Api } from '../api';

export interface WorkoutSetInfo {
  intensity: number | null;
  reps: number | null;
  tempo: string;
}

export interface ExerciseBlockItem {
  dayExerciseId?: any;   // "id" in update_day_plan (existing exercises only)
  name: string;
  isExpanded: boolean;
  equipment: string;
  muscleGroup: string;
  videoAttachedPath: string | null;
  videoFile?: File | null;
  videoLink?: string;
  sets: WorkoutSetInfo[];
}

@Component({
  selector: 'app-add-day-plan',
  templateUrl: './add-day-plan.page.html',
  styleUrls: ['./add-day-plan.page.scss'],
  standalone: false,
})
export class AddDayPlanPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  // Add mode
  @Input() workoutPlanId: number | string | null = null;

  // Edit mode (sent by workout-plan-detail)
  @Input() dayId: number | string | null = null;
  @Input() initialDayTitle: string = '';
  @Input() initialIsRestDay: boolean = false;
  @Input() initialExercisesList: any[] = [];
  @Input() isEditMode: boolean = false;

  dayTitle = '';
  isRestDay: boolean = false;
  exercisesList: ExerciseBlockItem[] = [];
  isSubmitting: boolean = false;

  private readonly MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

  // Filled from the exercise_list API
  exerciseOptions: string[] = [];
  exerciseIdMap: { [name: string]: string } = {};
  exerciseMeta: { [name: string]: { equipment: string; muscleGroup: string } } = {};

  constructor(
    private modalController: ModalController,
    private commonService: Common,
    private apiService: Api
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.dayTitle = this.initialDayTitle || '';
      this.isRestDay = !!this.initialIsRestDay;

      if (!this.isRestDay && this.initialExercisesList && this.initialExercisesList.length > 0) {
        this.exercisesList = this.initialExercisesList.map(item => {
          // Keep the saved exercise in the dropdown with its id
          if (item.name && !this.exerciseOptions.includes(item.name)) {
            this.exerciseOptions.push(item.name);
          }
          if (item.name && item.exerciseId) {
            this.exerciseIdMap[item.name] = String(item.exerciseId);
          }

          return {
            dayExerciseId: item.dayExerciseId,
            name: item.name || '',
            isExpanded: item.isExpanded !== undefined ? item.isExpanded : true,
            equipment: item.equipment || '',
            muscleGroup: item.muscleGroup || '',
            videoAttachedPath: item.videoAttachedPath || null,
            videoFile: null,
            videoLink: item.videoLink || '',
            sets: item.sets && item.sets.length > 0 ? item.sets.map((s: any) => ({
              intensity: s.intensity ?? null,
              reps: s.reps ?? null,
              tempo: s.tempo || ''
            })) : [{ intensity: null, reps: null, tempo: '' }]
          } as ExerciseBlockItem;
        });
      } else if (!this.isRestDay) {
        this.initializeExercise();
      }
    } else {
      this.initializeExercise();
    }

    this.exercise_list();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // ---------- exercise_list ----------
  exercise_list() {
    let listData: any = {};
    listData.search = '';
    console.log(listData);

    this.apiService.exercise_list(listData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);

      // check the real key: data / exercises / exercise_list
      const list: any[] = response?.data || response?.exercises || response?.exercise_list || [];

      list.forEach((e: any) => {
        const name = String(e.name ?? e.exercise_name ?? '').trim();
        const id = e.exercise_id ?? e.id;
        if (!name || id === undefined || id === null) { return; }

        if (!this.exerciseOptions.includes(name)) {
          this.exerciseOptions.push(name);
        }
        this.exerciseIdMap[name] = String(id);
        this.exerciseMeta[name] = {
          equipment: e.equipment || e.equipment_name || '',
          muscleGroup: e.muscle_group || e.muscle_group_name || ''
        };
      });

      // Exercises still without a name get the first one in the list
      this.exercisesList.forEach(ex => {
        if (!ex.name && this.exerciseOptions.length > 0) {
          ex.name = this.exerciseOptions[0];
          this.applyExerciseMeta(ex);
        }
      });
    },
    respError => {
      console.log(respError);
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // Fills equipment and muscle group from the API, only when they are empty
  private applyExerciseMeta(ex: ExerciseBlockItem) {
    const meta = this.exerciseMeta[ex.name];
    if (!meta) { return; }
    if (!ex.equipment) { ex.equipment = meta.equipment; }
    if (!ex.muscleGroup) { ex.muscleGroup = meta.muscleGroup; }
  }

  // Called when the user picks another exercise (optional HTML line, see below)
  onExerciseChange(index: number) {
    const ex = this.exercisesList[index];
    const meta = this.exerciseMeta[ex.name];
    if (!meta) { return; }
    ex.equipment = meta.equipment;
    ex.muscleGroup = meta.muscleGroup;
  }

  private newExerciseBlock(): ExerciseBlockItem {
    const first = this.exerciseOptions[0] || '';
    const block: ExerciseBlockItem = {
      name: first,
      isExpanded: true,
      equipment: '',
      muscleGroup: '',
      videoAttachedPath: null,
      videoFile: null,
      videoLink: '',
      sets: [{ intensity: null, reps: null, tempo: '' }]
    };
    this.applyExerciseMeta(block);
    return block;
  }

  initializeExercise() {
    this.exercisesList = [this.newExerciseBlock()];
  }

  // Rest day toggle: ON clears everything, OFF gives one fresh empty exercise
  onRestDayToggle(event: any) {
    this.isRestDay = !!event?.detail?.checked;
    if (this.isRestDay) {
      this.exercisesList = [];
    } else {
      this.initializeExercise();
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  toggleExerciseExpand(index: number) {
    this.exercisesList[index].isExpanded = !this.exercisesList[index].isExpanded;
  }

  addNewExerciseNode() {
    this.exercisesList.push(this.newExerciseBlock());
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
      currentSets.push({ intensity: null, reps: null, tempo: '' });
    }
    if (change === -1 && currentSets.length > 1) {
      currentSets.pop();
    }
  }

  triggerVideoAttachmentPlaceholder(exerciseIndex: number, setIndex: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';

    input.onchange = (event: any) => {
      const file: File = event.target.files && event.target.files[0];
      if (!file) {
        return;
      }
      if (file.size > this.MAX_VIDEO_SIZE) {
        this.commonService.showToastMessage('Video must be 10MB or smaller.', 'toast-error', '', 3000);
        return;
      }
      this.exercisesList[exerciseIndex].videoFile = file;
      this.exercisesList[exerciseIndex].videoAttachedPath = file.name;
      this.commonService.showToastMessage(`Exercise ${exerciseIndex + 1}: ${file.name} selected`, 'toast-success', '', 2000);
    };

    input.click();
  }

  // Builds "exercises" like the Postman bodies (add and update)
  private buildExercisesPayload(): any[] | null {
    const result: any[] = [];

    for (let i = 0; i < this.exercisesList.length; i++) {
      const ex = this.exercisesList[i];

      if (!ex.name) {
        this.commonService.showToastMessage(`Please select exercise ${i + 1}.`, 'toast-error', '', 3000);
        return null;
      }

      const exerciseId = this.exerciseIdMap[ex.name];
      if (!exerciseId) {
        this.commonService.showToastMessage(`Exercise id missing for "${ex.name}".`, 'toast-error', '', 3000);
        return null;
      }

      const item: any = {
        exercise_id: exerciseId,
        equipment: (ex.equipment || '').trim(),
        muscle_group: (ex.muscleGroup || '').trim(),
        sets: ex.sets.map(s => ({
          intensity_kg: Number(s.intensity) || 0,
          reps: Number(s.reps) || 0,
          tempo: (s.tempo || '').trim()
        }))
      };

      // Update only: existing exercises send their row id
      if (this.isEditMode && ex.dayExerciseId) {
        item.id = ex.dayExerciseId;
      }

      if (ex.videoLink && ex.videoLink.trim() && !ex.videoFile) {
        item.video_link = ex.videoLink.trim();
      }

      result.push(item);
    }
    return result;
  }

  processFormSubmission() {
    if (this.isSubmitting) return;

    // ----- Rest day -----
    if (this.isRestDay) {
      if (this.isEditMode) {
        if (!this.dayId) {
          this.commonService.showToastMessage('Day id missing.', 'toast-error', '', 2000);
          return;
        }
        this.update_day_plan([]);
      } else {
        if (!this.workoutPlanId) {
          this.commonService.showToastMessage('Workout plan id missing.', 'toast-error', '', 2000);
          return;
        }
        this.add_rest_day();
      }
      return;
    }

    // ----- Workout day -----
    if (!this.dayTitle.trim()) {
      this.commonService.showToastMessage('Please enter Day Name', 'toast-error', '', 2000);
      return;
    }

    if (this.isEditMode) {
      if (!this.dayId) {
        this.commonService.showToastMessage('Day id missing.', 'toast-error', '', 2000);
        return;
      }
      const exercises = this.buildExercisesPayload();
      if (!exercises) return;
      this.update_day_plan(exercises);
      return;
    }

    if (!this.workoutPlanId) {
      this.commonService.showToastMessage('Workout plan id missing.', 'toast-error', '', 2000);
      return;
    }

    const exercises = this.buildExercisesPayload();
    if (!exercises) return;

    const hasVideoFiles = this.exercisesList.some(ex => !!ex.videoFile);

    if (hasVideoFiles) {
      this.add_day_plan_with_video(exercises);
    } else {
      this.add_day_plan(exercises);
    }
  }

  // ---------- update_day_plan ----------
  private update_day_plan(exercises: any[]) {
    let updateDay: any = {};
    updateDay.day_id = this.dayId;
    updateDay.name = this.dayTitle.trim() || (this.isRestDay ? 'Rest Day' : '');
    updateDay.is_rest_day = this.isRestDay;
    updateDay.exercises = this.isRestDay ? [] : exercises;
    console.log(updateDay);

    this.isSubmitting = true;
    this.commonService.presentLoading();
    this.apiService.update_day_plan(updateDay)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(response?.message || 'Day plan updated successfully', 'toast-success', '', 2000);
      this.modalController.dismiss({ updated: true, response: response });
    },
    respError => {
      this.onAddError(respError);
    });
  }

  // ---------- add_day_plan: rest day ----------
  private add_rest_day() {
    let restDay: any = {};
    restDay.workout_plan_id = this.workoutPlanId;
    restDay.name = this.dayTitle.trim() || 'Rest Day';
    restDay.is_rest_day = true;
    restDay.exercises = [];
    console.log(restDay);

    this.isSubmitting = true;
    this.commonService.presentLoading();
    this.apiService.add_day_plan(restDay)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      this.onAddSuccess(response, 'Rest day added successfully');
    },
    respError => {
      this.onAddError(respError);
    });
  }

  // ---------- add_day_plan: JSON body ----------
  private add_day_plan(exercises: any[]) {
    let addDay: any = {};
    addDay.workout_plan_id = this.workoutPlanId;
    addDay.name = this.dayTitle.trim();
    addDay.exercises = exercises;
    console.log(addDay);

    this.isSubmitting = true;
    this.commonService.presentLoading();
    this.apiService.add_day_plan(addDay)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      this.onAddSuccess(response, 'Day plan added successfully');
    },
    respError => {
      this.onAddError(respError);
    });
  }

  // ---------- add_day_plan: form-data body (video upload) ----------
  private add_day_plan_with_video(exercises: any[]) {
    const formData = new FormData();
    formData.append('workout_plan_id', String(this.workoutPlanId));
    formData.append('name', this.dayTitle.trim());
    formData.append('exercises', JSON.stringify(exercises));

    this.exercisesList.forEach((ex, i) => {
      if (ex.videoFile) {
        formData.append('video_' + i, ex.videoFile);
      }
    });

    this.isSubmitting = true;
    this.commonService.presentLoading();
    this.apiService.add_day_plan_with_video(formData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      this.onAddSuccess(response, 'Day plan added successfully');
    },
    respError => {
      this.onAddError(respError);
    });
  }

  private onAddSuccess(response: any, defaultMessage: string) {
    console.log(response);
    this.isSubmitting = false;
    this.commonService.dismissLoading();
    this.commonService.showToastMessage(response?.message || defaultMessage, 'toast-success', '', 2000);
    this.modalController.dismiss({ added: true, response: response });
  }

  private onAddError(respError: any) {
    console.log(respError);
    this.isSubmitting = false;
    this.commonService.dismissLoading();
    this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
  }
}