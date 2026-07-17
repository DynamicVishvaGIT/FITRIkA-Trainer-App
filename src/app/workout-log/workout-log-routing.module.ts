import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutLogPage } from './workout-log.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutLogPageRoutingModule {}
