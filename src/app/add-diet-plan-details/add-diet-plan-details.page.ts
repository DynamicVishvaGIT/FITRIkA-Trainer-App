import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StaticFoodItem } from '../diet-plan-details/diet-plan-details.page';
import { Common } from '../common';
import { Api } from '../api';

@Component({
  selector: 'app-add-diet-plan-details',
  templateUrl: './add-diet-plan-details.page.html',
  styleUrls: ['./add-diet-plan-details.page.scss'],
  standalone: false
})
export class AddDietPlanDetailsPage implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  mealId: string = '';
  mealName: string = '';
  isEditingMealName: boolean = false;
  currentItems: StaticFoodItem[] = [];
  dropdownOpen: boolean = false;
  selectedDropdownFood: any = null;
  parentPlanMeta: any = null;
  isSubmitting: boolean = false;

  // Filled from the food_list API
  availableFoodsMaster: any[] = [];

  constructor(
    private router: Router,
    private commonService: Common,
    private apiService: Api
  ) {
    this._unsubscribeAll = new Subject();

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.mealId = navigation.extras.state['mealId'] || '';
      this.mealName = navigation.extras.state['mealName'] || 'Meal';
      this.parentPlanMeta = navigation.extras.state['parentMeta'];

      const loadedItems = navigation.extras.state['existingItems'] || [];
      this.currentItems = JSON.parse(JSON.stringify(loadedItems));
    }
  }

  ngOnInit(): void {
    this.food_list();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // ---------- food_list ----------
  food_list() {
    let foodData: any = {};
    foodData.search = '';
    console.log(foodData);

    this.apiService.food_list(foodData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      // check the real key: data / foods
      const list: any[] = response?.data || response?.foods || response?.food_list || [];
      this.availableFoodsMaster = list.map((f: any) => ({
        id: String(f.food_id ?? f.id),
        name: f.name || f.food_name || '',
        servingSize: f.serving_size || f.serving || '',
        calories: Number(f.calories ?? f.kcal) || 0,
        protein: Number(f.protein) || 0,
        fats: Number(f.fats ?? f.fat) || 0,
        carbs: Number(f.carbs ?? f.carbohydrates) || 0
      }));
    },
    respError => {
      console.log(respError);
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectFoodFromDropdown(food: any, event: Event): void {
    event.stopPropagation();
    this.selectedDropdownFood = food;

    // Same food twice: add one to its quantity
    const existing = this.currentItems.find(i => i.id === food.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.currentItems.push({
        id: food.id,
        name: food.name,
        servingSize: food.servingSize,
        quantity: 1,
        calories: food.calories,
        protein: food.protein,
        fats: food.fats,
        carbs: food.carbs
      });
    }
    this.dropdownOpen = false;
  }

  enableMealNameEdit(): void {
    this.isEditingMealName = !this.isEditingMealName;
    if (!this.isEditingMealName) {
      this.saveMealName();
    }
  }

  saveMealName(): void {
    if (!this.mealName || this.mealName.trim() === '') {
      this.mealName = 'Meal';
    }
    this.isEditingMealName = false;
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

  // Back to the diet plan, same plan / week / day
  private goToPlan(): void {
    this.router.navigate(['/diet-plan-details'], {
      queryParams: {
        id: this.parentPlanMeta?.planId,
        week: this.parentPlanMeta?.week,
        day: this.parentPlanMeta?.day
      }
    });
  }

  goBack(): void {
    this.goToPlan();
  }

  // ---------- update_diet_meal (Save Meal Foods) ----------
  submitDietDetails(): void {
    this.saveMealName();
    if (this.isSubmitting) return;

    if (!this.mealId) {
      this.commonService.showToastMessage('Meal id missing. Please try again.', 'toast-error', '', 2000);
      return;
    }

    let mealData: any = {};
    mealData.meal_id = this.mealId;
    mealData.name = this.mealName.trim();
    mealData.items = this.currentItems.map(i => ({ food_id: i.id, quantity: i.quantity }));
    console.log(mealData);

    this.isSubmitting = true;
    this.commonService.presentLoading();
    this.apiService.save_meal_foods(mealData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
      console.log(response);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(response?.message || 'Meal saved successfully', 'toast-success', '', 2000);
      this.goToPlan();
    },
    respError => {
      console.log(respError);
      this.isSubmitting = false;
      this.commonService.dismissLoading();
      this.commonService.showToastMessage(respError, 'toast-error', '', 4000);
    });
  }
}