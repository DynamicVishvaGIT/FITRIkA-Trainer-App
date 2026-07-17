import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSlotPage } from './edit-slot.page';

const routes: Routes = [
  {
    path: '',
    component: EditSlotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSlotPageRoutingModule {}
