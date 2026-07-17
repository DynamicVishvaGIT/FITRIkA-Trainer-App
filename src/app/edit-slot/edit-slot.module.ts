import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSlotPageRoutingModule } from './edit-slot-routing.module';

import { EditSlotPage } from './edit-slot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditSlotPageRoutingModule
  ],
  declarations: [EditSlotPage]
})
export class EditSlotPageModule {}
