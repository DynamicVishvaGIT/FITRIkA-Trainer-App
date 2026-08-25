import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';

interface CalendarDay {
  label: string;
  dateNum: number;
  fullDateString: string; // Format: 'YYYY-MM-DD'
  isActive: boolean;
}

interface AppointmentItem {
  id: number;
  dateKey: string; // Matches fullDateString
  time: string;     // e.g., '1:00 PM'
  endTime: string;  // e.g., '2:30 PM'
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

  currentYear: number = 2026;
  currentMonthIndex: number = 0; // 0 = January
  currentMonthYear: string = 'January 2026';
  
  monthsList: string[] = [
    'January 2026', 'February 2026', 'March 2026', 'April 2026', 
    'May 2026', 'June 2026', 'July 2026', 'August 2026', 
    'September 2026', 'October 2026', 'November 2026', 'December 2026'
  ];

  calendarDays: CalendarDay[] = [];
  
  allAppointments: AppointmentItem[] = [
    {
      id: 101,
      dateKey: '2026-01-17',
      time: '1:00 ',
      endTime: '2:30 ',
      clientName: 'Astha Dhaliwal',
      type: 'Personal Training',
      avatar: 'assets/images/astha.png',
      isCheckedIn: false
    },
    {
      id: 102,
      dateKey: '2026-01-17',
      time: '2:30 ',
      endTime: '3:30 ',
      clientName: 'Vikas Kumar',
      type: 'Personal Training',
      avatar: 'assets/images/vikas.png',
      isCheckedIn: false
    },
    {
      id: 103,
      dateKey: '2026-01-17',
      time: '3:00 ',
      endTime: '4:00 ',
      clientName: 'Nivan S',
      type: 'Personal Training',
      avatar: 'assets/images/nivan.png',
      isCheckedIn: true
    },
    {
      id: 104,
      dateKey: '2026-01-20',
      time: '10:00 ',
      endTime: '11:15 ',
      clientName: 'Rohit Sharma',
      type: 'Strength & Conditioning',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      isCheckedIn: false
    }
  ];

  filteredAppointments: AppointmentItem[] = [];

  constructor(
    private router: Router,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.generateCalendarDaysForMonth(this.currentMonthIndex, 16);
    this.updateAppointmentsForSelectedDay();
  }

  generateCalendarDaysForMonth(monthIdx: number, startDayNum: number) {
    this.currentMonthYear = this.monthsList[monthIdx];
    const monthStr = (monthIdx + 1 < 10 ? '0' + (monthIdx + 1) : (monthIdx + 1));
    const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    this.calendarDays = [];
    for (let i = 0; i < 6; i++) {
      let dNum = startDayNum + i;
      if (dNum > 31) dNum = dNum - 31;
      
      const dayFormatted = dNum < 10 ? '0' + dNum : '' + dNum;
      const dateString = `${this.currentYear}-${monthStr}-${dayFormatted}`;
      const dayOfWeekIndex = (i + 1) % 7; 

      this.calendarDays.push({
        label: dayLabels[dayOfWeekIndex],
        dateNum: dNum,
        fullDateString: dateString,
        isActive: i === 1
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  selectDay(selectedDay: CalendarDay) {
    this.calendarDays.forEach(day => day.isActive = (day.dateNum === selectedDay.dateNum && day.fullDateString === selectedDay.fullDateString));
    this.updateAppointmentsForSelectedDay();
    this.presentToast(`Loaded schedule for ${selectedDay.fullDateString}`);
  }

  updateAppointmentsForSelectedDay() {
    const activeDay = this.calendarDays.find(d => d.isActive);
    if (activeDay) {
      this.filteredAppointments = this.allAppointments.filter(app => app.dateKey === activeDay.fullDateString);
    } else {
      this.filteredAppointments = [];
    }
  }

  previousMonth() {
    if (this.currentMonthIndex > 0) {
      this.currentMonthIndex--;
      this.generateCalendarDaysForMonth(this.currentMonthIndex, 1);
      this.updateAppointmentsForSelectedDay();
      this.presentToast(`Switched to ${this.monthsList[this.currentMonthIndex]}`);
    } else {
      this.presentToast('Beginning of calendar year');
    }
  }

  nextMonth() {
    if (this.currentMonthIndex < this.monthsList.length - 1) {
      this.currentMonthIndex++;
      this.generateCalendarDaysForMonth(this.currentMonthIndex, 1);
      this.updateAppointmentsForSelectedDay();
      this.presentToast(`Switched to ${this.monthsList[this.currentMonthIndex]}`);
    } else {
      this.presentToast('End of calendar year');
    }
  }

  async toggleCheckIn(appointment: AppointmentItem) {
    appointment.isCheckedIn = !appointment.isCheckedIn;
    
    const masterIndex = this.allAppointments.findIndex(a => a.id === appointment.id);
    if (masterIndex !== -1) {
      this.allAppointments[masterIndex].isCheckedIn = appointment.isCheckedIn;
    }

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
      header: `Manage Session: ${appointment.clientName} (${appointment.time})`,
      cssClass: 'custom-manage-sheet',
      buttons: [
        { 
          text: 'Reschedule Session', 
          icon: 'time-outline', 
          handler: () => this.presentToast('Reschedule option selected') 
        },
        { 
          text: 'View Client Profile', 
          icon: 'person-outline', 
          handler: () => this.router.navigate(['/profile']) 
        },
        { 
          text: 'Cancel Appointment', 
          role: 'destructive', 
          icon: 'trash-outline', 
          handler: () => {
            this.allAppointments = this.allAppointments.filter(a => a.id !== appointment.id);
            this.updateAppointmentsForSelectedDay();
            this.presentToast('Appointment cancelled', 'danger');
          } 
        },
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

  goHome() { this.router.navigate(['/dashboard']); }
  goSchedule() { this.router.navigate(['/schedule']); }
  goWorkout() { this.router.navigate(['/workout-plans']); }
  goDiet() { this.router.navigate(['/diet-plan']); }
  goProfile() { this.router.navigate(['/profile']); }
}