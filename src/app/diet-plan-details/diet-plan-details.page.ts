import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ModalController
} from '@ionic/angular';
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

  private _unsubscribeAll = new Subject<any>();

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

  selectedDayIndex = 1;
  selectedWeek = 1;
  availableWeeks: number[] = [];
  weekIds: string[] = [];

  private pendingSelectLast = false;

  totalDayCalories = 0;

  planName = '';
  planDescription = '';
  planTags: string[] = [];

  dayData: {
    [dayIdx: number]: {
      dayId: any;
      meals: StaticMealSlot[];
    };
  } = {};

  meals: StaticMealSlot[] = [];

  // protein / fats / carbs of every food, taken from food_list
  foodMacroLookup: { [foodId: string]: { protein: number; fats: number; carbs: number } } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private commonService: Common,
    private apiService: Api
  ) {}

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;

    this.planId = q.get('id');

    if (q.get('week')) {
      this.selectedWeek = Number(q.get('week')) || 1;
    }

    if (q.get('day')) {
      this.selectedDayIndex = Number(q.get('day'));
    }

    console.log('Diet plan id:', this.planId);

    this.loadFoodMacros();
  }

  ionViewWillEnter(): void {
    if (this.planId) {
      this.diet_plan_details(true);
    } else {
      this.commonService.showToastMessage(
        'Diet plan id missing. Please try again.',
        'toast-error',
        '',
        2000
      );
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // ---------- MACRO HELPERS ----------

  // finds a macro value under any key name, also inside nested objects
  private findMacro(obj: any, test: RegExp, depth = 0): number {
    if (!obj || typeof obj !== 'object' || depth > 2) {
      return 0;
    }

    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (test.test(k) && v !== null && v !== '' && typeof v !== 'object' && !isNaN(Number(v))) {
        return Number(v);
      }
    }

    for (const k of Object.keys(obj)) {
      if (obj[k] && typeof obj[k] === 'object') {
        const r = this.findMacro(obj[k], test, depth + 1);
        if (r) {
          return r;
        }
      }
    }

    return 0;
  }

  private readMacros(...sources: any[]): { protein: number; fats: number; carbs: number } {
    const get = (test: RegExp): number => {
      for (const s of sources) {
        const v = this.findMacro(s, test);
        if (v) {
          return v;
        }
      }
      return 0;
    };

    return {
      protein: get(/protein/i),
      fats: get(/fat/i),
      carbs: get(/carb/i)
    };
  }

  // loads the macros of all foods once, so every meal card can draw its graph
  private loadFoodMacros(): void {
    this.apiService.food_list({ search: '' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: any) => {
          const list: any[] = response?.data || response?.foods || response?.food_list || [];
          list.forEach((f: any) => {
            this.foodMacroLookup[String(f.food_id ?? f.id)] = this.readMacros(f);
          });
        },
        error => {
          console.log(error);
        }
      );
  }

  // uses the macros of the item; if they are empty, uses the food_list macros
  private macroOf(item: StaticFoodItem): { protein: number; fats: number; carbs: number } {
    if (item.protein + item.fats + item.carbs > 0) {
      return item;
    }
    return this.foodMacroLookup[item.id] || item;
  }

  // ---------- MAP TAGS ----------

  private mapTags(tags: any[]): string[] {
    return (tags || [])
      .map((t: any) => {
        if (t === null || t === undefined) {
          return '';
        }

        if (typeof t !== 'object') {
          return String(t);
        }

        const known =
          t.name ??
          t.tag_name ??
          t.tag ??
          t.label ??
          t.title ??
          t.value;

        if (known !== undefined && known !== null) {
          return String(known);
        }

        const firstText = Object.keys(t)
          .filter(k => !/id$/i.test(k))
          .map(k => t[k])
          .find(
            v => typeof v === 'string' && v.trim().length > 0
          );

        return firstText ? String(firstText) : '';
      })
      .filter((t: string) => t.length > 0);
  }

  // ---------- DIET PLAN DETAILS ----------

  diet_plan_details(showLoader = false): void {
    const detailsData: any = {
      diet_plan_id: this.planId
    };

    if (showLoader) {
      this.commonService.presentLoading();
    }

    this.apiService.diet_plan_details(detailsData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: any) => {
          console.log(response);

          const plan: any =
            response?.data ||
            response?.diet_plan ||
            response?.plan ||
            response;

          this.planName = plan?.name || '';
          this.planDescription = plan?.description || '';
          this.planTags = this.mapTags(plan?.tags);

          const weeks: any[] =
            plan?.weeks ||
            plan?.diet_weeks ||
            [];

          this.weekIds = weeks.map((w: any) =>
            String(
              typeof w === 'object'
                ? (w.week_id ?? w.id)
                : w
            )
          );

          this.availableWeeks = this.weekIds.map(
            (_, i) => i + 1
          );

          if (this.pendingSelectLast) {
            this.selectedWeek = this.availableWeeks.length;
            this.pendingSelectLast = false;
          }

          if (this.selectedWeek > this.availableWeeks.length) {
            this.selectedWeek = Math.max(
              1,
              this.availableWeeks.length
            );
          }

          this.week_details(showLoader ? 'open' : 'none');
        },
        error => {
          console.log(error);

          if (showLoader) {
            this.commonService.dismissLoading();
          }

          this.commonService.showToastMessage(
            error,
            'toast-error',
            '',
            4000
          );
        }
      );
  }

  // ---------- WEEK DETAILS ----------

  week_details(
    loader: 'new' | 'open' | 'none' = 'none'
  ): void {
    const weekId = this.weekIds[this.selectedWeek - 1];

    if (!weekId) {
      this.dayData = {};
      this.syncActiveMeals();

      if (loader !== 'none') {
        this.commonService.dismissLoading();
      }

      return;
    }

    const weekData: any = {
      week_id: weekId
    };

    if (loader === 'new') {
      this.commonService.presentLoading();
    }

    this.apiService.week_details(weekData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: any) => {
          console.log(response);

          if (loader !== 'none') {
            this.commonService.dismissLoading();
          }

          const week: any =
            response?.data ||
            response?.week ||
            response;

          const days: any[] =
            week?.days ||
            week?.diet_days ||
            [];

          this.dayData = {};

          days.forEach((d: any, i: number) => {
            const idx = this.dayIndexOf(d, i);

            this.dayData[idx] = {
              dayId: d.day_id ?? d.id,
              meals: (d.meals || d.diet_meals || [])
                .map((m: any) => this.mapMeal(m))
            };
          });

          this.syncActiveMeals();
        },
        error => {
          console.log(error);

          if (loader !== 'none') {
            this.commonService.dismissLoading();
          }

          this.commonService.showToastMessage(
            error,
            'toast-error',
            '',
            4000
          );
        }
      );
  }

  // ---------- DAY INDEX ----------

  private dayIndexOf(d: any, position: number): number {
    const name = String(
      d.name || d.day_name || d.day || ''
    ).toLowerCase().trim();

    if (name.length >= 3) {
      const index = this.days.findIndex(x =>
        x.full.toLowerCase().startsWith(name.slice(0, 3))
      );

      if (index >= 0) {
        return index;
      }
    }

    return position;
  }

  // ---------- MAP MEAL ----------

  private mapMeal(m: any): StaticMealSlot {
    return {
      id: String(m.meal_id ?? m.id),
      name: m.name || 'Meal',
      items: (m.items || m.foods || [])
        .map((i: any) => this.mapItem(i))
    };
  }

  // ---------- MAP FOOD ----------

  private mapItem(i: any): StaticFoodItem {
    const f = i.food || i;
    const macros = this.readMacros(f, i);

    return {
      id: String(i.food_id ?? f.food_id ?? f.id),
      name: f.name || f.food_name || '',
      servingSize: f.serving_size || f.serving || '',
      quantity: Number(i.quantity) || 1,
      calories: Number(f.calories ?? f.kcal) || 0,
      protein: macros.protein,
      fats: macros.fats,
      carbs: macros.carbs
    };
  }

  // ---------- ADD WEEK ----------

  addNewWeek(): void {
    const weekData: any = {
      diet_plan_id: this.planId
    };

    this.commonService.presentLoading();

    this.apiService.add_week(weekData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: any) => {
          console.log(response);

          this.commonService.dismissLoading();

          this.commonService.showToastMessage(
            response?.message || 'Week added successfully',
            'toast-success',
            '',
            2000
          );

          this.pendingSelectLast = true;
          this.diet_plan_details(true);
        },
        error => {
          console.log(error);

          this.commonService.dismissLoading();

          this.commonService.showToastMessage(
            error,
            'toast-error',
            '',
            4000
          );
        }
      );
  }

  // ---------- DELETE WEEK ----------

  async deleteWeek(
    weekNumber: number,
    event: Event
  ): Promise<void> {
    event.stopPropagation();

    if (this.availableWeeks.length <= 1) {
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Delete Week',
      message: `Are you sure you want to delete Week ${weekNumber}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.delete_week(weekNumber)
        }
      ]
    });

    await alert.present();
  }

  private delete_week(weekNumber: number): void {
    const deleteData: any = {
      week_id: this.weekIds[weekNumber - 1]
    };

    this.commonService.presentLoading();

    this.apiService.delete_week(deleteData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: any) => {
          console.log(response);

          this.commonService.dismissLoading();

          this.commonService.showToastMessage(
            response?.message || 'Week deleted successfully',
            'toast-success',
            '',
            2000
          );

          if (this.selectedWeek >= weekNumber) {
            this.selectedWeek = Math.max(
              1,
              this.selectedWeek - 1
            );
          }

          this.diet_plan_details(true);
        },
        error => {
          console.log(error);

          this.commonService.dismissLoading();

          this.commonService.showToastMessage(
            error,
            'toast-error',
            '',
            4000
          );
        }
      );
  }

  // ---------- SELECT WEEK ----------

  selectWeek(weekNumber: number): void {
    this.selectedWeek = weekNumber;
    this.week_details('new');
  }

  // ---------- SELECT DAY ----------

  selectDay(index: number): void {
    this.selectedDayIndex = index;
    this.syncActiveMeals();
  }

  // ---------- ACTIVE MEALS ----------

  syncActiveMeals(): void {
    this.meals =
      this.dayData[this.selectedDayIndex]?.meals || [];

    this.calculateTotalCalories();
  }

  // ---------- CLEAR / DELETE MEAL ----------

  async clearMeal(mealId: string): Promise<void> {
    const meal = this.meals.find(m => m.id === mealId);

    if (!meal) {
      return;
    }

    const buttons: any[] = [];

    if (meal.items.length > 0) {
      buttons.push({
        text: 'Clear foods',
        handler: () => this.clearMealFoods(meal)
      });
    }

    buttons.push({
      text: 'Delete meal',
      role: 'destructive',
      handler: () => this.delete_meal(meal)
    });

    buttons.push({
      text: 'Cancel',
      role: 'cancel'
    });

    const sheet = await this.actionSheetCtrl.create({
      header: meal.name,
      buttons
    });

    await sheet.present();
  }

  // ---------- CLEAR MEAL FOODS ----------

  private clearMealFoods(meal: StaticMealSlot): void {
    const mealData: any = {
      meal_id: meal.id,
      name: meal.name,
      items: []
    };

    this.commonService.presentLoading();

    this.apiService.save_meal_foods(mealData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: any) => {
          console.log(response);

          this.commonService.dismissLoading();

          this.commonService.showToastMessage(
            response?.message || 'Meal cleared',
            'toast-success',
            '',
            2000
          );

          this.week_details('new');
        },
        error => {
          console.log(error);

          this.commonService.dismissLoading();

          this.commonService.showToastMessage(
            error,
            'toast-error',
            '',
            4000
          );
        }
      );
  }

  // ---------- DELETE MEAL ----------

  private delete_meal(meal: StaticMealSlot): void {
    const deleteData: any = {
      meal_id: meal.id
    };

    this.commonService.presentLoading();

    this.apiService.delete_meal(deleteData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: any) => {
          console.log(response);

          this.commonService.dismissLoading();

          this.commonService.showToastMessage(
            response?.message || 'Meal deleted successfully',
            'toast-success',
            '',
            2000
          );

          this.week_details('new');
        },
        error => {
          console.log(error);

          this.commonService.dismissLoading();

          this.commonService.showToastMessage(
            error,
            'toast-error',
            '',
            4000
          );
        }
      );
  }

  // ---------- ADD MEAL AFTER ----------

  async addMealAfter(meal: StaticMealSlot): Promise<void> {
    const dayId =
      this.dayData[this.selectedDayIndex]?.dayId;

    if (!dayId) {
      this.commonService.showToastMessage(
        'Day id not found for this day.',
        'toast-error',
        '',
        2500
      );

      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Add Meal',
      inputs: [
        {
          name: 'mealName',
          type: 'text',
          value: 'Snack',
          placeholder: 'Meal name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data: any) => {
            const name = (data.mealName || '').trim();

            if (!name) {
              return false;
            }

            this.add_meal(dayId, name, meal.id);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  // ---------- ADD MEAL API ----------

  private add_meal(
    dayId: any,
    name: string,
    afterMealId: string
  ): void {
    const mealData: any = {
      day_id: dayId,
      name,
      after_meal_id: afterMealId
    };

    this.commonService.presentLoading();

    this.apiService.add_meal(mealData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: any) => {
          console.log(response);

          this.commonService.dismissLoading();

          this.commonService.showToastMessage(
            response?.message || 'Meal added successfully',
            'toast-success',
            '',
            2000
          );

          this.week_details('new');
        },
        error => {
          console.log(error);

          this.commonService.dismissLoading();

          this.commonService.showToastMessage(
            error,
            'toast-error',
            '',
            4000
          );
        }
      );
  }

  // ---------- TOTAL CALORIES ----------

  calculateTotalCalories(): void {
    this.totalDayCalories = this.meals.reduce(
      (total, meal) => {
        return total + meal.items.reduce(
          (sum, item) =>
            sum + item.calories * item.quantity,
          0
        );
      },
      0
    );
  }

  // ---------- MEAL CALORIES ----------

  getMealCalories(meal: StaticMealSlot): number {
    return meal.items.reduce(
      (total, item) =>
        total + item.calories * item.quantity,
      0
    );
  }

  // ---------- MACRO PERCENTAGES ----------

  getMealMacroPercents(
    meal: StaticMealSlot
  ): {
    protein: number;
    fats: number;
    carbs: number;
  } {
    const totals = meal.items.reduce(
      (acc, item) => {
        const m = this.macroOf(item);
        acc.protein += m.protein * item.quantity;
        acc.fats += m.fats * item.quantity;
        acc.carbs += m.carbs * item.quantity;

        return acc;
      },
      {
        protein: 0,
        fats: 0,
        carbs: 0
      }
    );

    const sum =
      totals.protein +
      totals.fats +
      totals.carbs;

    if (sum === 0) {
      return {
        protein: 0,
        fats: 0,
        carbs: 0
      };
    }

    const protein = Math.round(
      totals.protein / sum * 100
    );

    const fats = Math.round(
      totals.fats / sum * 100
    );

    const carbs = 100 - protein - fats;

    return {
      protein,
      fats,
      carbs
    };
  }

  // ---------- DONUT GRADIENT ----------

  getDonutGradient(meal: StaticMealSlot): string {
    const p = this.getMealMacroPercents(meal);

    if (p.protein + p.fats + p.carbs === 0) {
      return '#e2e8f0';
    }

    const proteinDeg = p.protein * 3.6;
    const fatsDeg = p.fats * 3.6;

    return `conic-gradient(from 0deg,
      #26a872 0deg ${proteinDeg}deg,
      #13835a ${proteinDeg}deg ${proteinDeg + fatsDeg}deg,
      #00da8b ${proteinDeg + fatsDeg}deg 360deg)`;
  }

  // ---------- MACRO LABELS ----------

  getMacroLabels(meal: StaticMealSlot): MacroLabel[] {
    const p = this.getMealMacroPercents(meal);

    const radius = 36;
    const labels: MacroLabel[] = [];

    const segments = [
      {
        key: 'protein',
        value: p.protein
      },
      {
        key: 'fats',
        value: p.fats
      },
      {
        key: 'carbs',
        value: p.carbs
      }
    ];

    let cumulativeDeg = 0;

    segments.forEach(seg => {
      const segDeg = seg.value * 3.6;

      if (seg.value > 0) {
        const midDeg =
          cumulativeDeg + segDeg / 2;

        const rad = midDeg * Math.PI / 180;

        labels.push({
          key: seg.key,
          value: seg.value,
          left: 50 + radius * Math.sin(rad),
          top: 50 - radius * Math.cos(rad)
        });
      }

      cumulativeDeg += segDeg;
    });

    return labels;
  }

  // ---------- ADD DIET PLAN DETAILS ----------

  navigateToAddDetails(meal: StaticMealSlot): void {
    this.router.navigate(
      ['/add-diet-plan-details'],
      {
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
      }
    );
  }

  // ---------- EDIT DIET PLAN ----------

  async navigateToEditPlan(): Promise<void> {
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
          isCopyable: true,
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

  // ---------- BACK ----------

  goBack(): void {
    this.router.navigate(['/diet-plan']);
  }
}