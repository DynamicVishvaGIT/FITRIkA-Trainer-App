import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DietPlanDetailsPageRoutingModule } from './diet-plan-details-routing.module';

import { DietPlanDetailsPage } from './diet-plan-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DietPlanDetailsPageRoutingModule
  ],
  declarations: [DietPlanDetailsPage]
})
export class DietPlanDetailsPageModule {}
