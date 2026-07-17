import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPackagePageRoutingModule } from './edit-package-routing.module';

import { EditPackagePage } from './edit-package.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPackagePageRoutingModule
  ],
  declarations: [EditPackagePage]
})
export class EditPackagePageModule {}
