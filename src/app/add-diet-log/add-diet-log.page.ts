import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-diet-log',
  templateUrl: './add-diet-log.page.html',
  styleUrls: ['./add-diet-log.page.scss'],
  standalone: false,
})
export class AddDietLogPage implements OnInit {

  programName: string = '';

  constructor(private modalCtrl: ModalController) {}

  // Added the missing lifecycle hook to satisfy the OnInit interface contract
  ngOnInit() {
    // Initialization logic can go here if needed later
  }

  // Closes the modal view passing back no values
  dismissModal() {
    this.modalCtrl.dismiss();
  }

  // Sends the form inputs back to parent component context
  submitData() {
    if (this.programName && this.programName.trim() !== '') {
      this.modalCtrl.dismiss({
        programName: this.programName.trim()
      });
    }
  }
}