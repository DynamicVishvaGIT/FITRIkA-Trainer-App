import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { EditSlotPage } from '../edit-slot/edit-slot.page';
import { AddSlotPage } from '../add-slot/add-slot.page';

interface Slot {
  id: number;
  date: number;
  startTime: string;
  endTime: string;
  status: 'Tej' | 'Rohan' | 'Free' | 'Blocked';
  statusLabel: string;
  type?: string;
}

@Component({
  selector: 'app-slot',
  templateUrl: './slot.page.html',
  styleUrls: ['./slot.page.scss'],
  standalone: false,
})
export class SlotPage implements OnInit {

  showProfile: boolean = true;
  selectedDate: number = 17; // Defaulting to TUE 17

  days = [
    { name: 'Mon', date: 16 },
    { name: 'Tue', date: 17 },
    { name: 'Wed', date: 18 },
    { name: 'Thu', date: 19 },
    { name: 'Fri', date: 20 },
    { name: 'Sat', date: 21 },
  ];

  // Master array holding all database slots
  slots: Slot[] = [
    { id: 1, date: 17, startTime: '6:00 AM', endTime: '7:00 AM', status: 'Tej', statusLabel: 'Tej / Deepika', type: 'Personal Training' },
    { id: 2, date: 17, startTime: '7:00 AM', endTime: '8:00 AM', status: 'Free', statusLabel: 'Free' },
    { id: 3, date: 17, startTime: '8:00 AM', endTime: '9:00 AM', status: 'Blocked', statusLabel: 'Blocked' },
    { id: 4, date: 17, startTime: '9:00 AM', endTime: '10:00 AM', status: 'Rohan', statusLabel: 'Rohan S.', type: 'Trial Session' },
  ];

  // The array bound to your HTML view loop (*ngFor="let slot of filteredSlots")
  filteredSlots: Slot[] = [];

 constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController 
  ) {}

  ngOnInit() {
    this.filterSlots();
  }
  goBack() {
    // Replace '/profile' with your project's actual profile page route if different
    this.navCtrl.navigateBack('/my-profile'); 
  }

  selectDay(date: number) {
    this.selectedDate = date;
    this.filterSlots();
  }

  // Refreshes the display view to show data matching the chosen header day
  filterSlots() {
    this.filteredSlots = this.slots.filter(slot => slot.date === this.selectedDate);
  }

  // FIXED: Open and process data back from Add Slot sheet
  async openAddSlotModal() {
    const modal = await this.modalCtrl.create({
      component: AddSlotPage,
      cssClass: 'oval-bottom-modal',
      initialBreakpoint: 0.55,
      breakpoints: [0, 0.55, 0.9],
      handle: false
    });

    await modal.present();

    // Capture dismissed data pack payload safely
    const { data } = await modal.onDidDismiss();
    
    if (data && data.slotData) {
      // Build an explicit structural object matching the Slot interface scheme
      const newSlot: Slot = {
        id: Date.now(), // Generate unique numeric ID
        date: this.selectedDate, // Save it explicitly to the day the user is looking at
        startTime: data.slotData.startTime,
        endTime: data.slotData.endTime,
        status: data.slotData.status,
        statusLabel: this.getStatusLabel(data.slotData.status),
        type: this.getStatusType(data.slotData.status)
      };

      // Push into the master collection state data array
      this.slots.push(newSlot);
      
      // CRUCIAL: Re-run the view filter so the UI updates instantly
      this.filterSlots();
    }
  }

  async openEditModal(slot: Slot) {
    const modal = await this.modalCtrl.create({
      component: EditSlotPage,
      cssClass: 'oval-bottom-modal',
      initialBreakpoint: 0.45,
      breakpoints: [0, 0.45, 0.8],
      handle: false,
      componentProps: {
        currentStatus: slot.status
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.updatedStatus) {
      const target = this.slots.find(s => s.id === slot.id);
      if (target) {
        target.status = data.updatedStatus;
        target.statusLabel = this.getStatusLabel(data.updatedStatus);
        target.type = this.getStatusType(data.updatedStatus);
        this.filterSlots();
      }
    }
  }

  deleteSlot(id: number) {
    this.slots = this.slots.filter(slot => slot.id !== id);
    this.filterSlots();
  }

  // Helper mappings
  private getStatusLabel(status: 'Tej' | 'Rohan' | 'Free' | 'Blocked'): string {
    if (status === 'Tej') return 'Tej / Deepika';
    if (status === 'Rohan') return 'Rohan S.';
    return status;
  }

  private getStatusType(status: 'Tej' | 'Rohan' | 'Free' | 'Blocked'): string | undefined {
    if (status === 'Tej') return 'Personal Training';
    if (status === 'Rohan') return 'Trial Session';
    return undefined;
  }
}