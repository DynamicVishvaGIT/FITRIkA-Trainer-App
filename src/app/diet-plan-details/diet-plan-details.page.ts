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

  selectedDayIndex: number = 1; // Default to Monday
  selectedWeek: number = 1;     // Active week index
  availableWeeks: number[] = [1]; // Dynamic list of week indices

  totalDayCalories: number = 0;

  planName: string = 'Calorie control program..';
  planDescription: string = 'A balanced nutrition plan focused on managing daily calorie intake without sacrificing essential nutrients. It helps support healthy weight loss.';

  // Deep map: weekNum -> dayIdx -> meals
  weekMealsTracker: { 
    [weekNum: number]: { [dayIdx: number]: StaticMealSlot[] } 
  } = {};

  meals: StaticMealSlot[] = [];

  constructor(private router: Router) {
    this.initializeDefaultWeek1();
    this.checkForReturnedData();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkForReturnedData();
    });
  }

  ngOnInit(): void {
    this.syncActiveMeals();
  }

  private initializeDefaultWeek1(): void {
    if (!this.weekMealsTracker[1]) {
      this.weekMealsTracker[1] = {
        0: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
        1: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
        2: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
        3: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
        4: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
        5: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
        6: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ]
      };
    }
  }

  /**
   * Adds new week and repeats current week content
   */
  addNewWeek(): void {
    const currentWeekNum = this.selectedWeek;
    const nextWeekNum = this.availableWeeks.length + 1;
    
    // Deep clone current week content to duplicate it
    const clonedWeekContent = JSON.parse(JSON.stringify(this.weekMealsTracker[currentWeekNum]));

    this.weekMealsTracker[nextWeekNum] = clonedWeekContent;
    this.availableWeeks.push(nextWeekNum);

    this.selectWeek(nextWeekNum);
  }

  /**
   * Deletes a week and re-indexes remaining weeks
   */
  deleteWeek(weekNumber: number, event: Event): void {
    event.stopPropagation();

    // Prevent deleting if only 1 week exists
    if (this.availableWeeks.length <= 1) {
      return;
    }

    delete this.weekMealsTracker[weekNumber];
    
    // Re-index remaining weeks sequentially
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

    // Adjust selected week safely
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

  checkForReturnedData(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state;
      
      if (state['updatedMealId']) {
        const mid = state['updatedMealId'];
        const mname = state['updatedMealName'];
        const mitems = state['updatedItems'] || [];
        
        const currentWeekDays = this.weekMealsTracker[this.selectedWeek];
        if (currentWeekDays) {
          const targetedDayMeals = currentWeekDays[this.selectedDayIndex];
          const index = targetedDayMeals.findIndex(m => m.id === mid);
          
          if (index !== -1) {
            targetedDayMeals[index].items = [...mitems];
            if (mname) {
              targetedDayMeals[index].name = mname;
            }
          }
        }
        
        this.syncActiveMeals();
      }
    }
  }

  syncActiveMeals(): void {
    if (this.weekMealsTracker[this.selectedWeek]) {
      this.meals = this.weekMealsTracker[this.selectedWeek][this.selectedDayIndex];
    } else {
      this.meals = [];
    }
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