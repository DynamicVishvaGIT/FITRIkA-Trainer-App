import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDietPlanDetailsPageRoutingModule } from './add-diet-plan-details-routing.module';

import { AddDietPlanDetailsPage } from './add-diet-plan-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDietPlanDetailsPageRoutingModule
  ],
  declarations: [AddDietPlanDetailsPage]
})
export class AddDietPlanDetailsPageModule {}
