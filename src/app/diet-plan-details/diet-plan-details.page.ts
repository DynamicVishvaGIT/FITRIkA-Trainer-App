import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
export class DietPlanDetailsPage implements OnInit {
  days = [
    { short: 'Sun', full: 'Sunday' },
    { short: 'Mon', full: 'Monday' },
    { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' },
    { short: 'Sat', full: 'Saturday' }
  ];

  selectedDayIndex: number = 1;
  selectedWeek: number = 1;
  availableWeeks: number[] = [1];

  totalDayCalories: number = 0;

  planName: string = 'Calorie control program';
  planDescription: string = 'A balanced nutrition plan focused on managing daily calorie intake without sacrificing essential nutrients. It helps support healthy weight loss.';

  weekMealsTracker: {
    [weekNum: number]: { [dayIdx: number]: StaticMealSlot[] }
  } = {};

  meals: StaticMealSlot[] = [];

  constructor(private router: Router) {
    this.initializeDefaultTracker();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.applyReturnedState();
    });
  }

  ngOnInit(): void {
    this.applyReturnedState();
    this.syncActiveMeals();
  }

  ionViewWillEnter(): void {
    this.applyReturnedState();
    this.syncActiveMeals();
  }

  private initializeDefaultTracker(): void {
    if (!this.weekMealsTracker[1]) {
      this.weekMealsTracker[1] = {};
    }
    for (let i = 0; i < 7; i++) {
      if (!this.weekMealsTracker[1][i]) {
        // Enforce strictly 3 unique default slots: breakfast, lunch, dinner
        this.weekMealsTracker[1][i] = [
          { id: 'breakfast', name: 'Breakfast', items: [] },
          { id: 'lunch', name: 'Lunch', items: [] },
          { id: 'dinner', name: 'Dinner', items: [] }
        ];
      }
    }
  }

  addNewWeek(): void {
    const currentWeekNum = this.selectedWeek;
    const nextWeekNum = this.availableWeeks.length + 1;

    const clonedWeekContent = JSON.parse(JSON.stringify(this.weekMealsTracker[currentWeekNum] || {}));

    this.weekMealsTracker[nextWeekNum] = clonedWeekContent;
    this.availableWeeks.push(nextWeekNum);

    this.selectWeek(nextWeekNum);
  }

  deleteWeek(weekNumber: number, event: Event): void {
    event.stopPropagation();

    if (this.availableWeeks.length <= 1) {
      return;
    }

    delete this.weekMealsTracker[weekNumber];

    const remainingTracker: { [weekNum: number]: { [dayIdx: number]: StaticMealSlot[] } } = {};
    const updatedWeeksList: number[] = [];

    const existingWeekKeys = Object.keys(this.weekMealsTracker)
      .map(k => Number(k))
      .sort((a, b) => a - b);

    existingWeekKeys.forEach((oldKey, index) => {
      const newKey = index + 1;
      remainingTracker[newKey] = this.weekMealsTracker[oldKey];
      updatedWeeksList.push(newKey);
    });

    this.weekMealsTracker = remainingTracker;
    this.availableWeeks = updatedWeeksList;

    if (this.selectedWeek > this.availableWeeks.length) {
      this.selectedWeek = this.availableWeeks.length;
    } else if (this.selectedWeek === weekNumber) {
      this.selectedWeek = Math.max(1, weekNumber - 1);
    }

    this.syncActiveMeals();
  }

  selectWeek(weekNumber: number): void {
    this.selectedWeek = weekNumber;
    this.syncActiveMeals();
  }

  private applyReturnedState(): void {
    const state = history.state;
    if (!state || !state['updatedMealId']) {
      return;
    }

    const mid = state['updatedMealId'];
    const mname = state['updatedMealName'];
    const mitems = state['updatedItems'] || [];

    if (!this.weekMealsTracker[this.selectedWeek]) {
      this.weekMealsTracker[this.selectedWeek] = {};
    }
    if (!this.weekMealsTracker[this.selectedWeek][this.selectedDayIndex]) {
      this.weekMealsTracker[this.selectedWeek][this.selectedDayIndex] = [
        { id: 'breakfast', name: 'Breakfast', items: [] },
        { id: 'lunch', name: 'Lunch', items: [] },
        { id: 'dinner', name: 'Dinner', items: [] }
      ];
    }

    const targetedDayMeals = this.weekMealsTracker[this.selectedWeek][this.selectedDayIndex];
    
    // Find slot by ID to update its specific items and name cleanly
    let targetMeal = targetedDayMeals.find(m => m.id === mid);
    
    if (targetMeal) {
      targetMeal.items = [...mitems];
      if (mname) {
        targetMeal.name = mname;
      }
    } else {
      // Fallback safeguard: if slot doesn't exist yet, ensure we only add if it doesn't duplicate existing IDs
      targetedDayMeals.push({ id: mid, name: mname || 'Meal', items: [...mitems] });
    }

    // Clear history state to avoid loops
    history.replaceState(
      { ...history.state, updatedMealId: null, updatedMealName: null, updatedItems: null },
      ''
    );

    this.syncActiveMeals();
  }

  syncActiveMeals(): void {
    if (!this.weekMealsTracker[this.selectedWeek]) {
      this.weekMealsTracker[this.selectedWeek] = {};
    }
    if (!this.weekMealsTracker[this.selectedWeek][this.selectedDayIndex]) {
      this.weekMealsTracker[this.selectedWeek][this.selectedDayIndex] = [
        { id: 'breakfast', name: 'Breakfast', items: [] },
        { id: 'lunch', name: 'Lunch', items: [] },
        { id: 'dinner', name: 'Dinner', items: [] }
      ];
    }

    this.meals = this.weekMealsTracker[this.selectedWeek][this.selectedDayIndex];
    this.calculateTotalCalories();
  }

  selectDay(index: number): void {
    this.selectedDayIndex = index;
    this.syncActiveMeals();
  }

  calculateTotalCalories(): void {
    const calculatedSum = this.meals.reduce((total, meal) => {
      return total + meal.items.reduce((sum, item) => sum + (item.calories * item.quantity), 0);
    }, 0);

    this.totalDayCalories = calculatedSum;
  }

  getMealCalories(meal: StaticMealSlot): number {
    return meal.items.reduce((total, item) => {
      return total + (item.calories * item.quantity);
    }, 0);
  }

  clearMeal(mealId: string): void {
    const index = this.meals.findIndex(m => m.id === mealId);
    if (index !== -1) {
      this.meals[index].items = [];
    }
    this.calculateTotalCalories();
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

  navigateToAddDetails(meal: StaticMealSlot): void {
    this.router.navigate(['/add-diet-plan-details'], {
      state: {
        mealId: meal.id,
        mealName: meal.name,
        existingItems: meal.items,
        parentMeta: {
          name: this.planName,
          description: this.planDescription
        }
      }
    });
  }

  navigateToEditPlan(): void {
    this.router.navigate(['/add-diet-plan-details'], {
      state: {
        mealId: 'breakfast',
        mealName: 'Breakfast',
        existingItems: []
      }
    });
  }

  goBack() {
    this.router.navigate(['/diet-plan']);
  }
}