import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDayPlanPageRoutingModule } from './add-day-plan-routing.module';

import { AddDayPlanPage } from './add-day-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDayPlanPageRoutingModule
  ],
  declarations: [AddDayPlanPage]
})
export class AddDayPlanPageModule {}
