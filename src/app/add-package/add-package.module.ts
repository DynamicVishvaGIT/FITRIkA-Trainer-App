import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPackagePageRoutingModule } from './add-package-routing.module';

import { AddPackagePage } from './add-package.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPackagePageRoutingModule
  ],
  declarations: [AddPackagePage]
})
export class AddPackagePageModule {}
