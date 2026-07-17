import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DietLogPage } from './diet-log.page';

const routes: Routes = [
  {
    path: '',
    component: DietLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DietLogPageRoutingModule {}
