import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';

interface CalendarDay {
  label: string;
  dateNum: number;
  fullDateString: string;
  isActive: boolean;
}

interface AppointmentItem {
  id: number;
  time: string;
  clientName: string;
  type: string;
  avatar: string;
  isCheckedIn: boolean;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: false,
})
export class SchedulePage implements OnInit {

  currentMonthYear: string = 'January 2026';
  
  calendarDays: CalendarDay[] = [
    { label: 'MON', dateNum: 16, fullDateString: '2026-01-16', isActive: false },
    { label: 'TUE', dateNum: 17, fullDateString: '2026-01-17', isActive: true },
    { label: 'WED', dateNum: 18, fullDateString: '2026-01-18', isActive: false },
    { label: 'THU', dateNum: 19, fullDateString: '2026-01-19', isActive: false },
    { label: 'FRI', dateNum: 20, fullDateString: '2026-01-20', isActive: false },
    { label: 'SAT', dateNum: 21, fullDateString: '2026-01-21', isActive: false }
  ];

  appointments: AppointmentItem[] = [
    {
      id: 101,
      time: '1:00 PM',
      clientName: 'Astha Dhaliwal',
      type: 'Personal Training',
      avatar: 'assets/images/astha.png',
      isCheckedIn: false
    },
    {
      id: 102,
      time: '2:30 PM',
      clientName: 'Vikas Kumar',
      type: 'Personal Training',
      avatar: 'assets/images/vikas.png',
      isCheckedIn: false
    },
    {
      id: 103,
      time: '3:00 PM',
      clientName: 'Nivan S',
      type: 'Personal Training',
      avatar: 'assets/images/nivan.png',
      isCheckedIn: true
    }
  ];

  constructor(
    private router: Router,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  selectDay(selectedDay: CalendarDay) {
    this.calendarDays.forEach(day => day.isActive = (day.dateNum === selectedDay.dateNum));
    this.presentToast(`Showing schedule for Jan ${selectedDay.dateNum}`);
  }

  previousMonth() {
    this.presentToast('Previous week loaded');
  }

  nextMonth() {
    this.presentToast('Next week loaded');
  }

  async toggleCheckIn(appointment: AppointmentItem) {
    appointment.isCheckedIn = !appointment.isCheckedIn;
    const message = appointment.isCheckedIn 
      ? `Checked in ${appointment.clientName} successfully.` 
      : `Cancelled check-in for ${appointment.clientName}.`;
    
    this.presentToast(message, 'success');
  }

  goToWorkoutLog(appointment: AppointmentItem) {
    this.router.navigate(['/workout-plans'], {
      state: { targetClient: appointment.clientName }
    });
  }

  async openMoreOptions(appointment: AppointmentItem) {
    const actionSheet = await this.actionSheetController.create({
      header: `Manage Session: ${appointment.clientName}`,
      buttons: [
        { text: 'Reschedule Session', icon: 'time-outline', handler: () => this.presentToast('Reschedule clicked') },
        { text: 'Cancel Appointment', role: 'destructive', icon: 'trash-outline', handler: () => this.presentToast('Cancel clicked') },
        { text: 'Close', role: 'cancel', icon: 'close-outline' }
      ]
    });
    await actionSheet.present();
  }

  private async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message,
      duration: 1200,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  // Footer Navigation Tabs
  goHome() { this.router.navigate(['/dashboard']); }
  goSchedule() { this.router.navigate(['/schedule']); }
  goWorkout() { this.router.navigate(['/workout-plans']); }
  goDiet() { this.router.navigate(['/diet-plan']); }
 
   goProfile()
    { this.router.navigate(['/profile']); }
}