import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';

interface CalendarDay {
  label: string;
  dateNum: number;
  fullDateString: string; // Format: 'YYYY-MM-DD'
  isActive: boolean;
  hasActivity?: boolean;
}

interface AppointmentItem {
  id: number;
  dateKey: string; 
  time: string;     
  endTime: string;  
  clientName: string;
  type: string;
  avatar: string;
  isCheckedIn: boolean;
  isOnline?: boolean;
  createdDate?: string;
  workoutTitle?: string;
  previousWorkout?: string;
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
      time: '1:00',
      endTime: '2:30',
      clientName: 'Astha Dhaliwal',
      type: 'Personal Training',
      avatar: 'assets/images/astha.png',
      isCheckedIn: true,
      isOnline: true,
      createdDate: '19/03/2026, 06:40 PM',
      workoutTitle: 'Full Body Strength & Core Conditi',
      previousWorkout: 'Upper Body Hypertrophy & Arms (16 Mar)'
    },
    {
      id: 102,
      dateKey: '2026-01-17',
      time: '3:30',
      endTime: '4:45',
      clientName: 'Vikas Kumar',
      type: 'Personal Training',
      avatar: 'assets/images/vikas.png',
      isCheckedIn: false,
      isOnline: true,
      createdDate: '19/03/2026, 06:40 PM',
      workoutTitle: 'Full Body Strength & Core Conditi',
      previousWorkout: 'Upper Body Hypertrophy & Arms (16 Mar)'
    }
  ];

  filteredAppointments: AppointmentItem[] = [];

  // Add Appointment State & Model
  isAddModalOpen: boolean = false;
  newAppointment = {
    clientName: '',
    type: 'Personal Training',
    time: '10:00',
    endTime: '11:00',
    workoutTitle: 'Full Body Workout'
  };

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

      const hasAppt = this.allAppointments.some(app => app.dateKey === dateString);

      this.calendarDays.push({
        label: dayLabels[dayOfWeekIndex],
        dateNum: dNum,
        fullDateString: dateString,
        isActive: i === 1,
        hasActivity: hasAppt
      });
    }
  }

  openAddModal() {
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  saveNewAppointment() {
    if (!this.newAppointment.clientName.trim()) {
      this.presentToast('Please enter client name', 'danger');
      return;
    }

    const activeDay = this.calendarDays.find(d => d.isActive);
    const targetDateKey = activeDay ? activeDay.fullDateString : '2026-01-17';

    const created: AppointmentItem = {
      id: Date.now(),
      dateKey: targetDateKey,
      time: this.newAppointment.time,
      endTime: this.newAppointment.endTime,
      clientName: this.newAppointment.clientName,
      type: this.newAppointment.type,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      isCheckedIn: false,
      isOnline: true,
      createdDate: new Date().toLocaleDateString(),
      workoutTitle: this.newAppointment.workoutTitle,
      previousWorkout: 'Initial Session Assessment'
    };

    this.allAppointments.push(created);
    this.generateCalendarDaysForMonth(this.currentMonthIndex, parseInt(targetDateKey.split('-')[2]));
    this.updateAppointmentsForSelectedDay();
    this.closeAddModal();
    this.presentToast('Appointment added successfully!', 'success');
  }

  selectDay(selectedDay: CalendarDay) {
    this.calendarDays.forEach(day => day.isActive = (day.dateNum === selectedDay.dateNum && day.fullDateString === selectedDay.fullDateString));
    this.updateAppointmentsForSelectedDay();
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
    }
  }

  nextMonth() {
    if (this.currentMonthIndex < this.monthsList.length - 1) {
      this.currentMonthIndex++;
      this.generateCalendarDaysForMonth(this.currentMonthIndex, 1);
      this.updateAppointmentsForSelectedDay();
    }
  }

  async toggleCheckIn(appointment: AppointmentItem) {
    appointment.isCheckedIn = !appointment.isCheckedIn;
    const masterIndex = this.allAppointments.findIndex(a => a.id === appointment.id);
    if (masterIndex !== -1) {
      this.allAppointments[masterIndex].isCheckedIn = appointment.isCheckedIn;
    }
    const message = appointment.isCheckedIn ? `Checked in ${appointment.clientName}` : `Cancelled check-in`;
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
        { text: 'Reschedule Session', icon: 'time-outline', handler: () => this.presentToast('Reschedule selected') },
        { text: 'View Client Profile', icon: 'person-outline', handler: () => this.router.navigate(['/profile']) },
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
    const toast = await this.toastController.create({ message, duration: 1200, position: 'bottom', color });
    await toast.present();
  }

  goHome() { this.router.navigate(['/dashboard']); }
  goSchedule() { this.router.navigate(['/schedule']); }
  goWorkout() { this.router.navigate(['/workout-plans']); }
  goDiet() { this.router.navigate(['/diet-plan']); }
  goProfile() { this.router.navigate(['/profile']); }
}