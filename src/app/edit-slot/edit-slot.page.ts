import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-slot',
  templateUrl: './edit-slot.page.html',
  styleUrls: ['./edit-slot.page.scss'],
  standalone: false,
})
export class EditSlotPage implements OnInit {

  @Input() currentStatus: string = 'Free';
  selectedStatus: string = 'Free';
  isDropdownOpen: boolean = false;

  // Resolves keys correctly to long form readable layout text inside the select display bar
  statusDisplayMap: { [key: string]: string } = {
    'Free': 'Free',
    'Blocked': 'Blocked',
    'Tej': 'Tej / Deepika (Personal Training)',
    'Rohan': 'Rohan S. (Trial Session)'
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.selectedStatus = this.currentStatus;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(optionValue: string) {
    this.selectedStatus = optionValue;
    this.isDropdownOpen = false; 
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submitChange() {
    // Correctly relays back standard token primitives back up to parent list variables loop
    this.modalCtrl.dismiss({
      updatedStatus: this.selectedStatus
    });
  }

  // Dynamic selector parsing helper
  get selectedStatusLabel(): string {
    return this.statusDisplayMap[this.selectedStatus] || this.selectedStatus;
  }
}