import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-workout-log',
  templateUrl: './add-workout-log.page.html',
  styleUrls: ['./add-workout-log.page.scss'],
  standalone:false,
})
export class AddWorkoutLogPage implements OnInit {

  workoutName: string = '';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  closeSheet() {
    this.modalCtrl.dismiss();
  }

  submitWorkout() {
    if (this.workoutName.trim()) {
      this.modalCtrl.dismiss({
        workoutName: this.workoutName.trim()
      });
    }
  }
}