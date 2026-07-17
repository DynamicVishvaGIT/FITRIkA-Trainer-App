import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutLogPageRoutingModule } from './workout-log-routing.module';

import { WorkoutLogPage } from './workout-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutLogPageRoutingModule
  ],
  declarations: [WorkoutLogPage]
})
export class WorkoutLogPageModule {}
