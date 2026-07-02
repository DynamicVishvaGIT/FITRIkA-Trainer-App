import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutPlansPage } from './workout-plans.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutPlansPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutPlansPageRoutingModule {}
