import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TomarTrabajoPage } from './tomar-trabajo.page';

const routes: Routes = [
  {
    path: '',
    component: TomarTrabajoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TomarTrabajoPageRoutingModule {}
