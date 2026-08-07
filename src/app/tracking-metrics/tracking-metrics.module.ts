import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackingMetricsPageRoutingModule } from './tracking-metrics-routing.module';

import { TrackingMetricsPage } from './tracking-metrics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackingMetricsPageRoutingModule
  ],
  declarations: [TrackingMetricsPage]
})
export class TrackingMetricsPageModule {}
