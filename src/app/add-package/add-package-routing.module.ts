import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPackagePage } from './add-package.page';

const routes: Routes = [
  {
    path: '',
    component: AddPackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPackagePageRoutingModule {}
