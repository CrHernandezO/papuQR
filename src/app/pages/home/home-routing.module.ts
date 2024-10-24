import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'administrador',
        loadChildren: () => import('../administrador/administrador.module').then( m => m.AdministradorPageModule)
      },
      {
        path: 'viajes',
        loadChildren: () => import('../viajes/viajes.module').then( m => m.ViajesPageModule)
      },
      {
        path: 'listar-viajes',
        loadChildren: () => import('../listar-viajes/listar-viajes.module').then( m => m.ListarViajesPageModule)
      },
      {
        path: 'tomar-viaje',
        loadChildren: () => import('../tomar-viaje/tomar-viaje.module').then( m => m.TomarViajePageModule)
      },
      {
        path: 'tomar-trabajo',
        loadChildren: () => import('../tomar-trabajo/tomar-trabajo.module').then( m => m.TomarTrabajoPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
