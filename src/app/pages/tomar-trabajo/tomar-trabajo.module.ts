import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TomarTrabajoPageRoutingModule } from './tomar-trabajo-routing.module';

import { TomarTrabajoPage } from './tomar-trabajo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TomarTrabajoPageRoutingModule
  ],
  declarations: [TomarTrabajoPage]
})
export class TomarTrabajoPageModule {}
