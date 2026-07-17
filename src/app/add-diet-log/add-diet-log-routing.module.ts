import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDietLogPage } from './add-diet-log.page';

const routes: Routes = [
  {
    path: '',
    component: AddDietLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDietLogPageRoutingModule {}
