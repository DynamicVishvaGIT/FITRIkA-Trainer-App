import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSlotPage } from './add-slot.page';

const routes: Routes = [
  {
    path: '',
    component: AddSlotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSlotPageRoutingModule {}
