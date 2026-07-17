import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDietPlanPageRoutingModule } from './add-diet-plan-routing.module';

import { AddDietPlanPage } from './add-diet-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDietPlanPageRoutingModule
  ],
  declarations: [AddDietPlanPage]
})
export class AddDietPlanPageModule {}
