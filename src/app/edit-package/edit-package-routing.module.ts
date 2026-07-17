import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPackagePage } from './edit-package.page';

const routes: Routes = [
  {
    path: '',
    component: EditPackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPackagePageRoutingModule {}
