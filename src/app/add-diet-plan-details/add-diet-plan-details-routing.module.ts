import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDietPlanDetailsPage } from './add-diet-plan-details.page';

const routes: Routes = [
  {
    path: '',
    component: AddDietPlanDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDietPlanDetailsPageRoutingModule {}
