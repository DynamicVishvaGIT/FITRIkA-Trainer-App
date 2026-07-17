import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeginAssessmentPage } from './begin-assessment.page';

const routes: Routes = [
  {
    path: '',
    component: BeginAssessmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeginAssessmentPageRoutingModule {}
