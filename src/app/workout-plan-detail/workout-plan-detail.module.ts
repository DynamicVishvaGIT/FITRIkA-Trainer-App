import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutPlanDetailPageRoutingModule } from './workout-plan-detail-routing.module';

import { WorkoutPlanDetailPage } from './workout-plan-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutPlanDetailPageRoutingModule
  ],
  declarations: [WorkoutPlanDetailPage]
})
export class WorkoutPlanDetailPageModule {}
