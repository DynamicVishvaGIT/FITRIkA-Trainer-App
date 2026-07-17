import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DietPlanPageRoutingModule } from './diet-plan-routing.module';

import { DietPlanPage } from './diet-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DietPlanPageRoutingModule
  ],
  declarations: [DietPlanPage]
})
export class DietPlanPageModule {}
