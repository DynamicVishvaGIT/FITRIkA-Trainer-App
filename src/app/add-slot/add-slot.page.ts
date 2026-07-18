import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-slot',
  templateUrl: './add-slot.page.html',
  styleUrls: ['./add-slot.page.scss'],
  standalone: false,
})
export class AddSlotPage {

  // Change initial values to empty strings so placeholders display first
  startTime: string = '';
  endTime: string = '';
  status: 'Free' | 'Blocked' | 'Tej' | 'Rohan' | '' = '';
  
  // Tracks which dropdown overlay is currently active
  activeDropdown: string | null = null;

  startTimeOptions: string[] = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '11:00 AM'];
  endTimeOptions: string[] = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '12:00 PM'];

  statusDisplayMap: { [key: string]: string } = {
    'Free': 'Free',
    'Blocked': 'Blocked',
    'Tej': 'Tej / Deepika (Personal Training)',
    'Rohan': 'Rohan S. (Trial Session)'
  };

  constructor(private modalCtrl: ModalController) {}

  toggleDropdown(dropdownType: string) {
    if (this.activeDropdown === dropdownType) {
      this.activeDropdown = null; 
    } else {
      this.activeDropdown = dropdownType; 
    }
  }

  selectStart(time: string) {
    this.startTime = time;
    this.activeDropdown = null;
  }

  selectEnd(time: string) {
    this.endTime = time;
    this.activeDropdown = null;
  }

  selectStatus(optionValue: 'Free' | 'Blocked' | 'Tej' | 'Rohan') {
    this.status = optionValue;
    this.activeDropdown = null;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    // Basic validation guard to make sure values are chosen before submission
    if (!this.startTime || !this.endTime || !this.status) {
      alert('Please select all fields before submitting.');
      return;
    }

    this.modalCtrl.dismiss({
      slotData: {
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.status
      }
    });
  }

  get selectedStatusLabel(): string {
    if (!this.status) return 'Select Initial Status';
    return this.statusDisplayMap[this.status] || this.status;
  }
}