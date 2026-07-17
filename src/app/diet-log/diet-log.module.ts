import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DietLogPageRoutingModule } from './diet-log-routing.module';

import { DietLogPage } from './diet-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DietLogPageRoutingModule
  ],
  declarations: [DietLogPage]
})
export class DietLogPageModule {}
