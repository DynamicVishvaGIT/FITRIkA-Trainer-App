import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutPlansPageRoutingModule } from './workout-plans-routing.module';

import { WorkoutPlansPage } from './workout-plans.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutPlansPageRoutingModule
  ],
  declarations: [WorkoutPlansPage]
})
export class WorkoutPlansPageModule {}
