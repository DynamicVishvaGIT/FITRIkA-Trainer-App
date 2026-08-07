import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackingMetricsPage } from './tracking-metrics.page';

const routes: Routes = [
  {
    path: '',
    component: TrackingMetricsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackingMetricsPageRoutingModule {}
