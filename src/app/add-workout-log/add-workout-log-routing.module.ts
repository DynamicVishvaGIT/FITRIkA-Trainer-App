import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddWorkoutLogPage } from './add-workout-log.page';

const routes: Routes = [
  {
    path: '',
    component: AddWorkoutLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddWorkoutLogPageRoutingModule {}
