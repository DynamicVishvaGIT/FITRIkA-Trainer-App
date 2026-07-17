import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFieldPageRoutingModule } from './add-field-routing.module';

import { AddFieldPage } from './add-field.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddFieldPageRoutingModule
  ],
  declarations: [AddFieldPage]
})
export class AddFieldPageModule {}
