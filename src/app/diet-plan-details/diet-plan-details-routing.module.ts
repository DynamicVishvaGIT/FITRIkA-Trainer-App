import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DietPlanDetailsPage } from './diet-plan-details.page';

const routes: Routes = [
  {
    path: '',
    component: DietPlanDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DietPlanDetailsPageRoutingModule {}
