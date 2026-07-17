import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-slot',
  templateUrl: './add-slot.page.html',
  styleUrls: ['./add-slot.page.scss'],
  standalone: false,
})
export class AddSlotPage {

  startTime: string = '11:00 AM';
  endTime: string = '12:00 PM';
  status: 'Free' | 'Blocked' | 'Tej' | 'Rohan' = 'Free';
  
  // Tracks which dropdown overlay is currently active ('start' | 'end' | 'status' | null)
  activeDropdown: string | null = null;

  // Custom datasets for your time dropdown lists
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
      this.activeDropdown = null; // Close if clicked again
    } else {
      this.activeDropdown = dropdownType; // Open targeted dropdown
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
    this.modalCtrl.dismiss({
      slotData: {
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.status
      }
    });
  }

  get selectedStatusLabel(): string {
    return this.statusDisplayMap[this.status] || this.status;
  }
}