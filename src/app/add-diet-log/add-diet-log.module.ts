import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDietLogPageRoutingModule } from './add-diet-log-routing.module';

import { AddDietLogPage } from './add-diet-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDietLogPageRoutingModule
  ],
  declarations: [AddDietLogPage]
})
export class AddDietLogPageModule {}
