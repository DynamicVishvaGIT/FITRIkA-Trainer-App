import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeginAssessmentPageRoutingModule } from './begin-assessment-routing.module';

import { BeginAssessmentPage } from './begin-assessment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeginAssessmentPageRoutingModule
  ],
  declarations: [BeginAssessmentPage]
})
export class BeginAssessmentPageModule {}
