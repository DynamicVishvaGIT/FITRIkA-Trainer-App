import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AddDietLogPage } from '../add-diet-log/add-diet-log.page';

@Component({
  selector: 'app-diet-log',
  templateUrl: './diet-log.page.html',
  styleUrls: ['./diet-log.page.scss'],
  standalone: false,
})
export class DietLogPage implements OnInit {

 dietLogs = [
    { title: 'Calorie control program..', date: '24/06/2026' },
    { title: 'Fat burn formula..', date: '23/06/2026' }
  ];

  matrixCells: Array<{ filled: boolean; hidden: boolean; label?: string }> = [];

  currentDate: Date = new Date(2026, 5, 1); // June 2026 default
  isDropdownOpen: boolean = false;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.populateHeatmapMatrix();
  }

  get currentMonthName(): string {
    return this.months[this.currentDate.getMonth()];
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  toggleMonthDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectMonth(monthIndex: number): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), monthIndex, 1);
    this.populateHeatmapMatrix();
    this.isDropdownOpen = false;
  }

  async addNewDietProgram(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddDietLogPage,
      cssClass: 'bottom-sheet-modal',
      breakpoints: [0, 0.45], 
      initialBreakpoint: 0.45,
      handle: false
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.programName) {
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
      
      this.dietLogs.unshift({
        title: data.programName,
        date: formattedDate
      });
    }
  }

  // Generates physical calendar dates correctly considering Leap Years, 28/29/30/31 offsets
  private populateHeatmapMatrix(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // First weekday of the selected month (0 = Sunday, 1 = Monday, etc.)
    const firstDayIndex = new Date(year, month, 1).getDay();

    // Total days in the selected month (handles leap year for February automatically)
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ filled: boolean; hidden: boolean; label?: string }> = [];

    // Add hidden spacer cells for leading empty weekday offsets
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ filled: false, hidden: true });
    }

    // Populate actual days of the month with dynamic simulated activity heat values
    for (let day = 1; day <= totalDaysInMonth; day++) {
      // Create a persistent mock activity layout using deterministic rules based on the date
      const hasDietActivity = (day + month) % 2 === 0 || day % 5 === 0;
      cells.push({
        filled: hasDietActivity,
        hidden: false,
        label: String(day)
      });
    }

    this.matrixCells = cells;
  }
}