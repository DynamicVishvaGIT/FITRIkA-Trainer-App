import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController, IonContent } from '@ionic/angular';
import { Common } from '../common';

interface Slot {
  time: string;
  name: string;
  booked: boolean;
}

interface CalCell {
  key: string;
  day: number;
  inMonth: boolean;
  selected: boolean;
  conflict: boolean;
  booked: number;
}

interface Conflict {
  key: string;
  time: string;
  day: number;
}

interface AssignClient {
  id: number;
  name: string;
  initials: string;
  planName: string;
  startDate: string;
  endDate: string;
  prevProgram: string;
  progress: number;
}

@Component({
  selector: 'app-assign',
  templateUrl: './assign.page.html',
  styleUrls: ['./assign.page.scss'],
  standalone: false,
})
export class AssignPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;

  // 'assign'   -> "Assigned Program" form (calendar, slots, client)
  // 'assigned' -> "Assigned Workout Plan" view (client card + plan card)
  mode: 'assign' | 'assigned' = 'assign';

  // ---------- Plan (comes from workout-details, falls back to demo data) ----------
  plan: any = {
    id: null,
    name: 'Beginner weight loss program..',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium tellus quis arcu mollis, in sodales dui volutpat.',
    tags: ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg'],
    is_system: true
  };
  planExpanded = false;

  // ---------- Workout type ----------
  workoutTypes: string[] = ['Push Workout', 'Pull Workout', 'Leg Workout', 'Core Workout', 'Cardio'];
  selectedType = '';

  // ---------- Calendar ----------
  readonly weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  private readonly monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  private readonly shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  private readonly dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  viewYear = 2026;
  viewMonth = 2; // March
  selectedDate = '2026-03-19';
  calendarCells: CalCell[] = [];

  private slotsByDate: { [key: string]: Slot[] } = {};
  conflicts: Conflict[] = [{ key: '2026-03-02', time: '12:00 PM', day: 2 }];

  // ---------- Clients ----------
  clients: AssignClient[] = [
    {
      id: 1,
      name: 'Astha Dhaliwal',
      initials: 'AD',
      planName: 'Beginner weight loss program',
      startDate: '01/01/2026',
      endDate: '01/02/2026',
      prevProgram: 'Upper Body Strength & Core',
      progress: 100
    },
    {
      id: 2,
      name: 'Rohit Verma',
      initials: 'RV',
      planName: 'Muscle gain starter',
      startDate: '15/01/2026',
      endDate: '15/03/2026',
      prevProgram: 'Full Body Power',
      progress: 80
    },
    {
      id: 3,
      name: 'Neha Kapoor',
      initials: 'NK',
      planName: 'Beginner weight loss program',
      startDate: '10/02/2026',
      endDate: '10/04/2026',
      prevProgram: 'Core & Mobility',
      progress: 65
    }
  ];
  selectedClientId: number | null = 1;

  // separate search boxes for the two views
  searchText = '';
  assignedSearchText = '';

  constructor(
    private router: Router,
    private location: Location,
    private alertCtrl: AlertController,
    private commonService: Common
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state && state['plan']) {
      this.plan = { ...this.plan, ...state['plan'] };
    }
  }

  ngOnInit(): void {
    this.seedSlots();
    this.buildCalendar();
  }

  /* ================= Header / navigation ================= */

  get headerTitle(): string {
    return this.mode === 'assign' ? 'Assigned Program' : 'Assigned Workout Plan';
  }

  goBack() {
    if (this.mode === 'assigned') {
      this.switchMode('assign');
    } else {
      this.location.back();
    }
  }

  private switchMode(mode: 'assign' | 'assigned') {
    this.mode = mode;
    setTimeout(() => this.content?.scrollToTop(0));
  }

  togglePlan() {
    this.planExpanded = !this.planExpanded;
  }

  editPlan(event: Event) {
    event.stopPropagation();
    if (this.plan?.id) {
      this.router.navigate(['/workout-details'], { queryParams: { id: this.plan.id } });
    } else {
      this.commonService.showToastMessage('Plan id not available.', 'toast-error', '', 2000);
    }
  }

  /* ================= Calendar ================= */

  get monthLabel(): string {
    return `${this.monthNames[this.viewMonth]} ${this.viewYear}`;
  }

  get weekOfMonth(): number {
    const day = parseInt(this.selectedDate.split('-')[2], 10);
    return Math.ceil(day / 7);
  }

  prevMonth() {
    this.viewMonth--;
    if (this.viewMonth < 0) {
      this.viewMonth = 11;
      this.viewYear--;
    }
    this.buildCalendar();
  }

  nextMonth() {
    this.viewMonth++;
    if (this.viewMonth > 11) {
      this.viewMonth = 0;
      this.viewYear++;
    }
    this.buildCalendar();
  }

  goToday() {
    const t = new Date();
    this.viewYear = t.getFullYear();
    this.viewMonth = t.getMonth();
    this.selectedDate = this.keyOf(t.getFullYear(), t.getMonth(), t.getDate());
    this.buildCalendar();
  }

  selectDate(cell: CalCell) {
    this.selectedDate = cell.key;
    if (!cell.inMonth) {
      const [y, m] = cell.key.split('-').map(n => parseInt(n, 10));
      this.viewYear = y;
      this.viewMonth = m - 1;
    }
    this.buildCalendar();
  }

  buildCalendar() {
    const first = new Date(this.viewYear, this.viewMonth, 1);
    const offset = (first.getDay() + 6) % 7; // Monday first
    const cells: CalCell[] = [];

    for (let i = 0; i < 42; i++) {
      const d = new Date(this.viewYear, this.viewMonth, 1 - offset + i);
      const key = this.keyOf(d.getFullYear(), d.getMonth(), d.getDate());
      cells.push({
        key,
        day: d.getDate(),
        inMonth: d.getMonth() === this.viewMonth,
        selected: key === this.selectedDate,
        conflict: this.conflicts.some(c => c.key === key),
        booked: (this.slotsByDate[key] || []).filter(s => s.booked).length
      });
    }
    this.calendarCells = cells;
  }

  /* ================= Slots ================= */

  get selectedDateLabel(): string {
    const [y, m, d] = this.selectedDate.split('-').map(n => parseInt(n, 10));
    const dt = new Date(y, m - 1, d);
    return `${this.dayNames[dt.getDay()]}, ${d} ${this.shortMonths[m - 1]} ${y}`;
  }

  get slots(): Slot[] {
    if (!this.slotsByDate[this.selectedDate]) {
      this.slotsByDate[this.selectedDate] = this.defaultSlots();
    }
    return this.slotsByDate[this.selectedDate];
  }

  get bookedCount(): number {
    return this.slots.filter(s => s.booked).length;
  }

  isConflictSlot(slot: Slot): boolean {
    return this.conflicts.some(c => c.key === this.selectedDate && c.time === slot.time);
  }

  assignSlot(slot: Slot) {
    if (!this.selectedType) {
      this.commonService.showToastMessage('Select a workout type first.', 'toast-error', '', 2000);
      return;
    }
    slot.name = this.selectedType;
    slot.booked = true;
    // the slot is now filled, so its overlap warning is resolved
    this.conflicts = this.conflicts.filter(c => !(c.key === this.selectedDate && c.time === slot.time));
    this.buildCalendar();
    this.commonService.showToastMessage(`${slot.name} assigned to ${slot.time}`, 'toast-success', '', 1500);
  }

  unassignSlot(slot: Slot) {
    slot.name = '';
    slot.booked = false;
    this.buildCalendar();
  }

  reviewConflict() {
    const c = this.conflicts[0];
    if (!c) {
      return;
    }
    const [y, m] = c.key.split('-').map(n => parseInt(n, 10));
    this.viewYear = y;
    this.viewMonth = m - 1;
    this.selectedDate = c.key;
    this.buildCalendar();
  }

  /* ================= Clients (assign view) ================= */

  get selectedClient(): AssignClient | undefined {
    return this.clients.find(c => c.id === this.selectedClientId);
  }

  get visibleClients(): AssignClient[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q && this.selectedClient) {
      return [this.selectedClient];
    }
    return this.clients.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.planName.toLowerCase().includes(q)
    );
  }

  onClientCardTap(client: AssignClient) {
    if (client.id === this.selectedClientId) {
      // tapping the selected client opens the "Assigned Workout Plan" view
      this.switchMode('assigned');
    } else {
      this.selectedClientId = client.id;
      this.searchText = '';
    }
  }

  removeClient(event: Event) {
    event.stopPropagation();
    this.selectedClientId = null;
  }

  /* ================= Assign Program ================= */

  async assignProgram() {
    const client = this.selectedClient;
    if (!client) {
      this.commonService.showToastMessage('Please select a client.', 'toast-error', '', 2000);
      return;
    }

    if (this.conflicts.length > 0) {
      const alert = await this.alertCtrl.create({
        header: 'Slot Sheet Overlap Warning',
        message: 'Some slots overlap. Do you want to assign the program anyway?',
        buttons: [
          { text: 'Review', role: 'cancel', handler: () => this.reviewConflict() },
          { text: 'Assign anyway', handler: () => this.finishAssign(client) }
        ]
      });
      await alert.present();
      return;
    }

    this.finishAssign(client);
  }

  private finishAssign(client: AssignClient) {
    // TODO: call your assign-program API here with client.id, this.plan.id and the booked slots
    this.commonService.showToastMessage(`Program assigned to ${client.name}`, 'toast-success', '', 2000);
    this.assignedSearchText = '';
    this.switchMode('assigned');
  }

  /* ================= Assigned view ================= */

  get showAssignedClient(): boolean {
    const c = this.selectedClient;
    if (!c) {
      return false;
    }
    const q = this.assignedSearchText.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.planName.toLowerCase().includes(q);
  }

  get showAssignedPlan(): boolean {
    const q = this.assignedSearchText.trim().toLowerCase();
    return !q || (this.plan.name || '').toLowerCase().includes(q);
  }

  /* ================= Helpers ================= */

  private keyOf(y: number, m: number, d: number): string {
    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    return `${y}-${pad(m + 1)}-${pad(d)}`;
  }

  private defaultSlots(): Slot[] {
    return [
      { time: '09:00 AM', name: '', booked: false },
      { time: '12:00 PM', name: '', booked: false },
      { time: '06:00 PM', name: '', booked: false }
    ];
  }

  // demo slots so the calendar looks like the design
  private seedSlots() {
    const mk = (time: string, name: string = ''): Slot => ({ time, name, booked: !!name });

    this.slotsByDate['2026-03-19'] = [mk('09:00 AM', 'Push Workout'), mk('12:00 PM'), mk('06:00 PM', 'Core Workout')];
    this.slotsByDate['2026-03-02'] = [mk('09:00 AM', 'Pull Workout'), mk('12:00 PM'), mk('06:00 PM')];

    ['2026-03-04', '2026-03-05', '2026-03-11', '2026-03-12', '2026-03-13', '2026-03-17', '2026-03-18', '2026-03-20']
      .forEach(k => {
        this.slotsByDate[k] = [mk('09:00 AM', 'Push Workout'), mk('12:00 PM'), mk('06:00 PM')];
      });
  }
}