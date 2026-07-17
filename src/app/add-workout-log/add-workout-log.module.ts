import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddWorkoutLogPageRoutingModule } from './add-workout-log-routing.module';

import { AddWorkoutLogPage } from './add-workout-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddWorkoutLogPageRoutingModule
  ],
  declarations: [AddWorkoutLogPage]
})
export class AddWorkoutLogPageModule {}
