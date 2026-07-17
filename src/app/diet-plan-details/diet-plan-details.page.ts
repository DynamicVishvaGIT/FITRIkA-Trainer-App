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
  selectedDayIndex: number = 1; // Defaults to Monday
  totalDayCalories: number = 2000; 

  planName: string = 'Calorie control program..';
  planDescription: string = 'A balanced nutrition plan focused on managing daily calorie intake without sacrificing essential nutrients. It helps support healthy weight loss.';
  
  // Master tracking data structure separated by day index (0-6)
  dayMealsTracker: { [key: number]: StaticMealSlot[] } = {
    0: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
    1: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
    2: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
    3: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
    4: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
    5: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ],
    6: [ { id: 'breakfast', name: 'Breakfast', items: [] }, { id: 'lunch', name: 'Lunch', items: [] }, { id: 'dinner', name: 'Dinner', items: [] } ]
  };

  // Active viewing template array reference
  meals: StaticMealSlot[] = [];

  constructor(private router: Router) {
    this.checkForReturnedData();

    // Listen to router navigation events to check for state updates when navigating backwards
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkForReturnedData();
    });
  }

  ngOnInit(): void {
    this.syncActiveMeals();
  }

  checkForReturnedData(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state;
      
      if (state['updatedMealId']) {
        const mid = state['updatedMealId'];
        const mitems = state['updatedItems'] || [];
        
        // Save the modifications to our master day matrix tracker
        const targetedDayMeals = this.dayMealsTracker[this.selectedDayIndex];
        const index = targetedDayMeals.findIndex(m => m.id === mid);
        if (index !== -1) {
          targetedDayMeals[index].items = mitems;
        }
        
        this.syncActiveMeals();
      }
    }
  }

  syncActiveMeals(): void {
    this.meals = this.dayMealsTracker[this.selectedDayIndex];
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
    
    // Fallback to layout default 2000 if empty, otherwise show dynamic calculation sum
    this.totalDayCalories = calculatedSum ;
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
        mealId: 'entire_plan',
        mealName: this.planName,
        existingItems: []
      }
    });
  }

  goBack() {
    this.router.navigate(['/diet-plan']);
  }
}