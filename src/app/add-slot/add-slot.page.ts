import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

type Status =
  | 'Free'
  | 'Blocked'
  | 'Tej'
  | 'Rohan'
  | '';

@Component({
  selector: 'app-add-slot',
  templateUrl: './add-slot.page.html',
  styleUrls: ['./add-slot.page.scss'],
  standalone: false,
})
export class AddSlotPage {

  /* =========================================
     FORM VALUES
  ========================================= */

  startTime: string = '';

  endTime: string = '';

  status: Status = '';


  /* =========================================
     ACTIVE DROPDOWN
  ========================================= */

  activeDropdown: 'start' | 'end' | 'status' | null = null;


  /* =========================================
     TIME OPTIONS
  ========================================= */

  startTimeOptions: string[] = [
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '11:00 AM'
  ];

  endTimeOptions: string[] = [
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '12:00 PM'
  ];


  /* =========================================
     STATUS LABELS
  ========================================= */

  statusDisplayMap: Record<string, string> = {

    Free: 'Free',

    Blocked: 'Blocked',

    Tej: 'Tej / Deepika (Personal Training)',

    Rohan: 'Rohan S. (Trial Session)'

  };


  /* =========================================
     CONSTRUCTOR
  ========================================= */

  constructor(
    private modalCtrl: ModalController
  ) {}


  /* =========================================
     TOGGLE DROPDOWN
  ========================================= */

  toggleDropdown(
    dropdownType: 'start' | 'end' | 'status'
  ): void {

    if (this.activeDropdown === dropdownType) {

      this.activeDropdown = null;

    } else {

      this.activeDropdown = dropdownType;

    }
  }


  /* =========================================
     CLOSE DROPDOWN
  ========================================= */

  closeDropdown(): void {

    this.activeDropdown = null;

  }


  /* =========================================
     SELECT START TIME
  ========================================= */

  selectStart(time: string): void {

    this.startTime = time;

    this.activeDropdown = null;

  }


  /* =========================================
     SELECT END TIME
  ========================================= */

  selectEnd(time: string): void {

    this.endTime = time;

    this.activeDropdown = null;

  }


  /* =========================================
     SELECT STATUS
  ========================================= */

  selectStatus(
    optionValue: Exclude<Status, ''>
  ): void {

    this.status = optionValue;

    this.activeDropdown = null;

  }


  /* =========================================
     CLOSE MODAL
  ========================================= */

  dismiss(): void {

    this.modalCtrl.dismiss();

  }


  /* =========================================
     SUBMIT
  ========================================= */

  submit(): void {

    if (
      !this.startTime ||
      !this.endTime ||
      !this.status
    ) {

      alert(
        'Please select all fields before submitting.'
      );

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


  /* =========================================
     STATUS DISPLAY LABEL
  ========================================= */

  get selectedStatusLabel(): string {

    if (!this.status) {

      return 'Select Initial Status';

    }

    return (
      this.statusDisplayMap[this.status]
      || this.status
    );

  }

}