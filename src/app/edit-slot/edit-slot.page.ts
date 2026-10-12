import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

interface StatusOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-edit-slot',
  templateUrl: './edit-slot.page.html',
  styleUrls: ['./edit-slot.page.scss'],
  standalone: false,
})
export class EditSlotPage implements OnInit {

  @Input() currentStatus = 'Free';

  selectedStatus = 'Free';
  isDropdownOpen = false;

  statusOptions: StatusOption[] = [
    {
      value: 'Free',
      label: 'Free'
    },
    {
      value: 'Blocked',
      label: 'Blocked'
    },
    {
      value: 'Tej',
      label: 'Tej / Deepika (Personal Training)'
    },
    {
      value: 'Rohan',
      label: 'Rohan S. (Trial Session)'
    }
  ];

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.selectedStatus = this.currentStatus;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: StatusOption): void {
    this.selectedStatus = option.value;
    this.isDropdownOpen = false;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  dismiss(): void {
    this.modalCtrl.dismiss();
  }

  submitChange(): void {
    this.modalCtrl.dismiss({
      updatedStatus: this.selectedStatus
    });
  }

  get selectedStatusLabel(): string {
    const option = this.statusOptions.find(
      item => item.value === this.selectedStatus
    );

    return option?.label || this.selectedStatus;
  }
}