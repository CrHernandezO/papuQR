import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarViajesPage } from './listar-viajes.page';

const routes: Routes = [
  {
    path: '',
    component: ListarViajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarViajesPageRoutingModule {}
