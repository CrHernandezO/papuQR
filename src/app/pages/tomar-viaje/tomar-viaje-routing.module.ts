import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TomarViajePage } from './tomar-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: TomarViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TomarViajePageRoutingModule {}
