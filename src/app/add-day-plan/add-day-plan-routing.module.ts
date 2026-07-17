import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDayPlanPage } from './add-day-plan.page';

const routes: Routes = [
  {
    path: '',
    component: AddDayPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDayPlanPageRoutingModule {}
