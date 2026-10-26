import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { AddDietPlanPage } from '../add-diet-plan/add-diet-plan.page';
import { Common } from '../common';
import { Api } from '../api';

export interface StaticFoodItem {
  id: string;
  name: string;
  servingSize: string;
  quantity: number;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

export interface StaticMealSlot {
  id: string;
  name: string;
  items: StaticFoodItem[];
}

export interface MacroLabel {
  key: string;
  value: number;
  left: number;
  top: number;
}

@Component({
  selector: 'app-diet-plan-details',
  templateUrl: './diet-plan-details.page.html',
  styleUrls: ['./diet-plan-details.page.scss'],
  standalone: false
})
export class DietPlanDetailsPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  days = [
    { short: 'Sun', full: 'Sunday' },
    { short: 'Mon', full: 'Monday' },
    { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' },
    { short: 'Sat', full: 'Saturday' }
  ];

  planId: string | null = null;

  selectedDayIndex: number = 1;
  selectedWeek: number = 1;
  availableWeeks: number[] = [];
  weekIds: string[] = [];
  private pendingSelectLast: boolean = false;

  totalDayCalories: number = 0;

  planName: string = '';
  planDescription: string = '';
  planTags: string[] = [];

  // Selected week: day index -> { day id, meals }
  dayData: { [dayIdx: number]: { dayId: any; meals: StaticMealSlot[] } } = {};

  meals: StaticMealSlot[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private commonService: Common,
    private apiService: Api
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    this.planId = q.get('id');
    if (q.get('week')) { this.selectedWeek = Number(q.get('week')) || 1; }
    if (q.get('day')) { this.selectedDayIndex = Number(q.get('day')); }
    console.log('Diet plan id:', this.planId);
  }

  // First open, and when coming back from add-diet-plan-details
  ionViewWillEnter(): void {
    if (this.planId) {
      this.diet_plan_details(true);
    } else {
      this.commonService.showToastMessage('Diet plan id missing. Please try again.', 'toast-error', '', 2000);
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // Tags from the API: text as it is, or the text field of a tag object
  private mapTags(tags: any[]): string[] {
    return (tags || [])
      .map((t: any) => {
        if (t === null || t === undefined) { return ''; }
        if (typeof t !== 'object') { return String(t); }

        // Known field names first
        const known = t.name ?? t.tag_name ?? t.tag ?? t.label ?? t.title ?? t.value;
        if (known !== undefined && known !== null) { return String(known); }

        // Otherwise the first text value in the object (ignores ids)
        const firstText = Object.keys(t)
          .filter(k => !/id$/i.test(k))
          .map(k => t[k])
          .find(v => typeof v === 'string' && v.trim().length > 0);
        return firstText ? String(firstText) : '';
      })
      .filter((t: string) => t.length > 0);
  }

  // ---------- diet_plan_details ----------
  diet_plan_details(showLoader: boolean = false) {
    let detailsData: any = {};
    detailsData.diet_plan_id = this.planId;
    console.log(detailsData);

    if (showLoader) {
      this.commonService.presentLoading();
    }

    this.apiService.diet_plan_details(detailsData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);

      const plan: any = response?.data || response?.diet_plan || response?.plan || response;

      this.planName = plan?.name || '';
      this.planDescription = plan?.description || '';
      this.planTags = this.mapTags(plan?.tags);

      const weeks: any[] = plan?.weeks || plan?.diet_weeks || [];
      this.weekIds = weeks.map((w: any) => String(typeof w === 'object' ? (w.week_id ?? w.id) : w));
      this.availableWeeks = this.weekIds.map((_, i) => i + 1);

      if (this.pendingSelectLast) {
        this.selectedWeek = this.availableWeeks.length;
        this.pendingSelectLast = false;
      }
      if (this.selectedWeek > this.availableWeeks.length) {
        this.selectedWeek = Math.max(1, this.availableWeeks.length);
      }

      // The loader (if any) is closed inside week_details
      this.week_details(showLoader ? 'open' : 'none');
    },
    respError => {
      console.log(respError);
      if (showLoader) {
        this.commonService.dismissLoading();
      }
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // ---------- week_details ----------
  // 'new' = show and hide its own loader, 'open' = only hide a loader already open, 'none' = no loader
  week_details(loader: 'new' | 'open' | 'none' = 'none') {
    const weekId = this.weekIds[this.selectedWeek - 1];

    if (!weekId) {
      this.dayData = {};
      this.syncActiveMeals();
      if (loader !== 'none') { this.commonService.dismissLoading(); }
      return;
    }

    let weekData: any = {};
    weekData.week_id = weekId;
    console.log(weekData);

    if (loader === 'new') {
      this.commonService.presentLoading();
    }

    this.apiService.week_details(weekData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      if (loader !== 'none') {
        this.commonService.dismissLoading();
      }

      const week: any = response?.data || response?.week || response;
      const days: any[] = week?.days || week?.diet_days || [];

      this.dayData = {};
      days.forEach((d: any, i: number) => {
        const idx = this.dayIndexOf(d, i);
        this.dayData[idx] = {
          dayId: d.day_id ?? d.id,
          meals: (d.meals || d.diet_meals || []).map((m: any) => this.mapMeal(m))
        };
      });

      this.syncActiveMeals();
    },
    respError => {
      console.log(respError);
      if (loader !== 'none') {
        this.commonService.dismissLoading();
      }
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // Weekday (0 = Sunday) of an API day: by name first, then by position
  private dayIndexOf(d: any, position: number): number {
    const name = String(d.name || d.day_name || d.day || '').toLowerCase().trim();
    if (name.length >= 3) {
      const k = this.days.findIndex(x => x.full.toLowerCase().startsWith(name.slice(0, 3)));
      if (k >= 0) { return k; }
    }
    return position;
  }

  private mapMeal(m: any): StaticMealSlot {
    return {
      id: String(m.meal_id ?? m.id),
      name: m.name || 'Meal',
      items: (m.items || m.foods || []).map((i: any) => this.mapItem(i))
    };
  }

  private mapItem(i: any): StaticFoodItem {
    const f = i.food || i;
    return {
      id: String(i.food_id ?? f.food_id ?? f.id),
      name: f.name || f.food_name || '',
      servingSize: f.serving_size || f.serving || '',
      quantity: Number(i.quantity) || 1,
      calories: Number(f.calories ?? f.kcal) || 0,
      protein: Number(f.protein) || 0,
      fats: Number(f.fats ?? f.fat) || 0,
      carbs: Number(f.carbs ?? f.carbohydrates) || 0
    };
  }

  // ---------- add_week ("+" on the week tabs) ----------
  addNewWeek(): void {
    let weekData: any = {};
    weekData.diet_plan_id = this.planId;
    console.log(weekData);

    this.commonService.presentLoading();
    this.apiService.add_week(weekData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(response?.message || 'Week added successfully', 'toast-success', '', 2000);
      this.pendingSelectLast = true;
      this.diet_plan_details(true);
    },
    respError => {
      console.log(respError);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // ---------- delete_week ("x" on a week tab) ----------
  async deleteWeek(weekNumber: number, event: Event) {
    event.stopPropagation();
    if (this.availableWeeks.length <= 1) { return; }

    const alert = await this.alertCtrl.create({
      header: 'Delete Week',
      message: `Are you sure you want to delete Week ${weekNumber}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: () => { this.delete_week(weekNumber); } }
      ]
    });
    await alert.present();
  }

  private delete_week(weekNumber: number) {
    let deleteData: any = {};
    deleteData.week_id = this.weekIds[weekNumber - 1];
    console.log(deleteData);

    this.commonService.presentLoading();
    this.apiService.delete_week(deleteData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(response?.message || 'Week deleted successfully', 'toast-success', '', 2000);
      if (this.selectedWeek >= weekNumber) {
        this.selectedWeek = Math.max(1, this.selectedWeek - 1);
      }
      this.diet_plan_details(true);
    },
    respError => {
      console.log(respError);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  selectWeek(weekNumber: number): void {
    this.selectedWeek = weekNumber;
    this.week_details('new');
  }

  selectDay(index: number): void {
    this.selectedDayIndex = index;
    this.syncActiveMeals();
  }

  syncActiveMeals(): void {
    this.meals = this.dayData[this.selectedDayIndex]?.meals || [];
    this.calculateTotalCalories();
  }

  // ---------- X on a meal card: clear foods or delete the meal ----------
  async clearMeal(mealId: string) {
    const meal = this.meals.find(m => m.id === mealId);
    if (!meal) { return; }

    const buttons: any[] = [];
    if (meal.items.length > 0) {
      buttons.push({ text: 'Clear foods', handler: () => { this.clearMealFoods(meal); } });
    }
    buttons.push({ text: 'Delete meal', role: 'destructive', handler: () => { this.delete_meal(meal); } });
    buttons.push({ text: 'Cancel', role: 'cancel' });

    const sheet = await this.actionSheetCtrl.create({ header: meal.name, buttons: buttons });
    await sheet.present();
  }

  // update_diet_meal with no items
  private clearMealFoods(meal: StaticMealSlot) {
    let mealData: any = {};
    mealData.meal_id = meal.id;
    mealData.name = meal.name;
    mealData.items = [];
    console.log(mealData);

    this.commonService.presentLoading();
    this.apiService.save_meal_foods(mealData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.commonService.showToastMessage(response?.message || 'Meal cleared', 'toast-success', '', 2000);
      this.week_details('open');
    },
    respError => {
      console.log(respError);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // ---------- delete_meal ----------
  private delete_meal(meal: StaticMealSlot) {
    let deleteData: any = {};
    deleteData.meal_id = meal.id;
    console.log(deleteData);

    this.commonService.presentLoading();
    this.apiService.delete_meal(deleteData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.commonService.showToastMessage(response?.message || 'Meal deleted successfully', 'toast-success', '', 2000);
      this.week_details('open');
    },
    respError => {
      console.log(respError);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  // ---------- add_meal (not called by the HTML now; kept for later) ----------
  async addMealAfter(meal: StaticMealSlot) {
    const dayId = this.dayData[this.selectedDayIndex]?.dayId;
    if (!dayId) {
      this.commonService.showToastMessage('Day id not found for this day.', 'toast-error', '', 2500);
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Add Meal',
      inputs: [{ name: 'mealName', type: 'text', value: 'Snack', placeholder: 'Meal name' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Add',
          handler: (d: any) => {
            const name = (d.mealName || '').trim();
            if (!name) { return false; }
            this.add_meal(dayId, name, meal.id);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  private add_meal(dayId: any, name: string, afterMealId: string) {
    let mealData: any = {};
    mealData.day_id = dayId;
    mealData.name = name;
    mealData.after_meal_id = afterMealId;
    console.log(mealData);

    this.commonService.presentLoading();
    this.apiService.add_meal(mealData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.commonService.showToastMessage(response?.message || 'Meal added successfully', 'toast-success', '', 2000);
      this.week_details('open');
    },
    respError => {
      console.log(respError);
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  calculateTotalCalories(): void {
    this.totalDayCalories = this.meals.reduce((total, meal) => {
      return total + meal.items.reduce((sum, item) => sum + (item.calories * item.quantity), 0);
    }, 0);
  }

  getMealCalories(meal: StaticMealSlot): number {
    return meal.items.reduce((total, item) => {
      return total + (item.calories * item.quantity);
    }, 0);
  }

  getMealMacroPercents(meal: StaticMealSlot): { protein: number; fats: number; carbs: number } {
    const totals = meal.items.reduce((acc, item) => {
      acc.protein += item.protein * item.quantity;
      acc.fats += item.fats * item.quantity;
      acc.carbs += item.carbs * item.quantity;
      return acc;
    }, { protein: 0, fats: 0, carbs: 0 });

    const sum = totals.protein + totals.fats + totals.carbs;
    if (sum === 0) {
      return { protein: 0, fats: 0, carbs: 0 };
    }

    const protein = Math.round((totals.protein / sum) * 100);
    const fats = Math.round((totals.fats / sum) * 100);
    const carbs = 100 - protein - fats;

    return { protein, fats, carbs };
  }

  getDonutGradient(meal: StaticMealSlot): string {
    const p = this.getMealMacroPercents(meal);

    if (p.protein + p.fats + p.carbs === 0) {
      return '#e2e8f0';
    }

    const proteinDeg = p.protein * 3.6;
    const fatsDeg = p.fats * 3.6;

    return `conic-gradient(from 0deg,
      #9b51e0 0deg ${proteinDeg}deg,
      #ff6b00 ${proteinDeg}deg ${proteinDeg + fatsDeg}deg,
      #ffbd00 ${proteinDeg + fatsDeg}deg 360deg)`;
  }

  getMacroLabels(meal: StaticMealSlot): MacroLabel[] {
    const p = this.getMealMacroPercents(meal);
    const radius = 36;
    const labels: MacroLabel[] = [];

    const segments = [
      { key: 'protein', value: p.protein },
      { key: 'fats', value: p.fats },
      { key: 'carbs', value: p.carbs }
    ];

    let cumulativeDeg = 0;

    segments.forEach(seg => {
      const segDeg = seg.value * 3.6;
      if (seg.value > 0) {
        const midDeg = cumulativeDeg + segDeg / 2;
        const rad = (midDeg * Math.PI) / 180;

        const left = 50 + radius * Math.sin(rad);
        const top = 50 - radius * Math.cos(rad);

        labels.push({ key: seg.key, value: seg.value, left, top });
      }
      cumulativeDeg += segDeg;
    });

    return labels;
  }

  // Opens add-diet-plan-details (update_diet_meal is called there)
  navigateToAddDetails(meal: StaticMealSlot): void {
    this.router.navigate(['/add-diet-plan-details'], {
      state: {
        mealId: meal.id,
        mealName: meal.name,
        existingItems: meal.items,
        parentMeta: {
          name: this.planName,
          description: this.planDescription,
          planId: this.planId,
          week: this.selectedWeek,
          day: this.selectedDayIndex
        }
      }
    });
  }

  // ---------- update_diet_plan (API is called inside the modal) ----------
  async navigateToEditPlan() {
    const modal = await this.modalController.create({
      component: AddDietPlanPage,
      cssClass: 'bottom-sheet-modal',
      initialBreakpoint: 1,
      breakpoints: [0, 0.92, 1],
      backdropDismiss: true,
      handle: false,
      componentProps: {
        editingPlan: {
          id: this.planId,
          name: this.planName,
          description: this.planDescription,
          tags: this.planTags,
          isSystemPlan: false,
          isUserCreated: true,
          isExpanded: false
        }
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.diet_plan_details(true);
    }
  }

  goBack() {
    this.router.navigate(['/diet-plan']);
  }
}