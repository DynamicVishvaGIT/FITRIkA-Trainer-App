import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaticFoodItem } from '../diet-plan-details/diet-plan-details.page';

// import { DietDataService, FoodItem } from '../diet-data.service';

@Component({
  selector: 'app-add-diet-plan-details',
  templateUrl: './add-diet-plan-details.page.html',
  styleUrls: ['./add-diet-plan-details.page.scss'],
  standalone: false
})
export class AddDietPlanDetailsPage implements OnInit {

 mealId!: string;
  mealName: string = 'Breakfast'; // Default fallback matched to design mock
  currentItems: StaticFoodItem[] = [];
  dropdownOpen: boolean = false;
  selectedDropdownFood: any = null;
  parentPlanMeta: any = null;

  // Master Static Food Dictionary Options
  availableFoodsMaster = [
    { name: 'Apple', servingSize: '1 Piece', calories: 50, protein: 0.4, fats: 0.9, carbs: 24.4 },
    { name: 'Oatmeal with Milk', servingSize: '1 Cup', calories: 238, protein: 10.1, fats: 9.9, carbs: 27.3 },
    { name: 'Banana', servingSize: '1 Medium', calories: 105, protein: 1.3, fats: 0.3, carbs: 27.0 },
    { name: 'Boiled Egg', servingSize: '1 Large', calories: 78, protein: 6.3, fats: 5.3, carbs: 0.6 }
  ];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.mealId = navigation.extras.state['mealId'] || 'breakfast';
      this.mealName = navigation.extras.state['mealName'] || 'Breakfast';
      this.parentPlanMeta = navigation.extras.state['parentMeta'];
      
      const loadedItems = navigation.extras.state['existingItems'] || [];
      this.currentItems = JSON.parse(JSON.stringify(loadedItems));
    }
  }

  ngOnInit(): void {
    // Populate mock fallback entries with precise ID bindings matching the image layout
    
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectFoodFromDropdown(food: any, event: Event): void {
    event.stopPropagation();
    
    const itemReference: StaticFoodItem = {
      id: 'food_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: food.name,
      servingSize: food.servingSize,
      quantity: 1,
      calories: food.calories,
      protein: food.protein,
      fats: food.fats,
      carbs: food.carbs
    };
    
    this.currentItems.push(itemReference);
    this.dropdownOpen = false;
  }

  updateQuantity(itemId: string, change: number): void {
    const item = this.currentItems.find(i => i.id === itemId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.currentItems = this.currentItems.filter(i => i.id !== itemId);
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/diet-plan-details'], {
      state: { selectedPlan: this.parentPlanMeta }
    });
  }

  submitDietDetails(): void {
    // Deliver modifications back to the parent component using the navigation pipeline
    this.router.navigate(['/diet-plan-details'], {
      state: {
        selectedPlan: this.parentPlanMeta,
        updatedMealId: this.mealId,
        updatedItems: this.currentItems
      }
    });
  }
}