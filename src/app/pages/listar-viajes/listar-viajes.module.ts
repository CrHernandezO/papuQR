import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarViajesPageRoutingModule } from './listar-viajes-routing.module';

import { ListarViajesPage } from './listar-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarViajesPageRoutingModule
  ],
  declarations: [ListarViajesPage]
})
export class ListarViajesPageModule {}
