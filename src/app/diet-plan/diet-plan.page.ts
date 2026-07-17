import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AddDietPlanPage } from '../add-diet-plan/add-diet-plan.page';

export interface DietPlanItem {
  id: string;
  name: string;
  description: string;
  isSystemPlan: boolean;
  isUserCreated: boolean;
  tags: string[];
  isExpanded: boolean;
}

@Component({
  selector: 'app-diet-plan',
  templateUrl: './diet-plan.page.html',
  styleUrls: ['./diet-plan.page.scss'],
  standalone: false,
})
export class DietPlanPage implements OnInit {

  searchQuery: string = '';
  isMyPlansOnly: boolean = false;
  
  masterDietPlans: DietPlanItem[] = [
    {
      id: 'plan_1',
      name: 'Calorie control program..',
      description: 'Tailored macro splits designed to manage daily caloric intake efficiently.',
      isSystemPlan: true,
      isUserCreated: false,
      tags: ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg'],
      isExpanded: false
    },
    {
      id: 'plan_2',
      name: 'Lean muscle fuel plan..',
      description: 'High protein distribution profile engineered for supporting hypertrophy adaptations.',
      isSystemPlan: true,
      isUserCreated: false,
      tags: ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg'],
      isExpanded: false
    },
    {
      id: 'plan_3',
      name: 'Fat burn formula..',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium tellus quis arcu mollis, in sodales dui volutpat.',
      isSystemPlan: true,
      isUserCreated: false,
      tags: ['Fat loss', 'Beginner', '4 weeks', 'push, pull, leg'],
      isExpanded: true // Render expanded initially to fit layout specifications
    }
  ];

  filteredPlans: DietPlanItem[] = [];

  constructor(
  private router: Router,
  private modalController: ModalController,
  private toastController: ToastController
) {

  const navigation = this.router.getCurrentNavigation();

  if (navigation?.extras?.state) {

    if (navigation.extras.state['newPlan']) {
      this.masterDietPlans.unshift(
        navigation.extras.state['newPlan']
      );
    }

    if (navigation.extras.state['updatedPlan']) {

      const updated = navigation.extras.state['updatedPlan'];

      const index = this.masterDietPlans.findIndex(
        x => x.id === updated.id
      );

      if (index !== -1) {
        this.masterDietPlans[index] = updated;
      }

    }

  }

}

  ngOnInit() {
    this.filterDietPlans();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  filterDietPlans() {
    let output = [...this.masterDietPlans];

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      output = output.filter(p => p.description.toLowerCase().includes(query) || p.name.toLowerCase().includes(query));
    }

    if (this.isMyPlansOnly) {
      output = output.filter(p => p.isUserCreated === true);
    }

    this.filteredPlans = output;
  }

  toggleCardExpansion(index: number) {
    this.filteredPlans[index].isExpanded = !this.filteredPlans[index].isExpanded;
  }
  navigateToDetails(plan: DietPlanItem) {
    this.router.navigate(['/diet-plan-details'], {
      state: { selectedPlan: plan }
    });
  }

  duplicatePlan(plan: DietPlanItem) {
    const copy: DietPlanItem = {
      ...plan,
      id: 'plan_' + Date.now(),
      name: `${plan.name} (Copy)`,
      isUserCreated: true,
      isSystemPlan: false,
      isExpanded: false
    };
    this.masterDietPlans.push(copy);
    this.filterDietPlans();
  }
  
 async openAddDietPlanModal() {

  const modal = await this.modalController.create({

    component: AddDietPlanPage,

    cssClass: 'bottom-sheet-modal',

    initialBreakpoint: 1,

    breakpoints: [0, 0.92, 1],

    backdropDismiss: true,
    

    handle: false,

    // showBackdrop: false

  });

  await modal.present();

  const { data } = await modal.onWillDismiss();

  if (data) {

    this.masterDietPlans = [

      {
        id: 'plan_' + Date.now(),

        name: data.name || 'New Diet Plan',

        description: data.description || '',

        tags: data.tags || [],

        isSystemPlan: false,

        isUserCreated: true,

        isExpanded: false
      },

      ...this.masterDietPlans

    ];

    this.filterDietPlans();

    const toast = await this.toastController.create({

      message: 'Diet Plan Added Successfully',

      duration: 1800,

      color: 'success',

      position: 'top'

    });

    await toast.present();

  }

}

  editDietPlan(plan: DietPlanItem) {

  this.router.navigate(
    ['/add-diet-plan'],
    {
      state: {
        editingPlan: plan
      }
    }
  );

}
}