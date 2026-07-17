import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDietPlanPage } from './add-diet-plan.page';

const routes: Routes = [
  {
    path: '',
    component: AddDietPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDietPlanPageRoutingModule {}
