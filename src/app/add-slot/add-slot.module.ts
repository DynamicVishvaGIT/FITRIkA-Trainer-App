import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSlotPageRoutingModule } from './add-slot-routing.module';

import { AddSlotPage } from './add-slot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSlotPageRoutingModule
  ],
  declarations: [AddSlotPage]
})
export class AddSlotPageModule {}
