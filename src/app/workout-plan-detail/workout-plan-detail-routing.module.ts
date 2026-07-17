import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutPlanDetailPage } from './workout-plan-detail.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutPlanDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutPlanDetailPageRoutingModule {}
