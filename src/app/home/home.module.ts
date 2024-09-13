import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { HeaderComponent } from '../Base/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MatProgressSpinner,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [HomePage, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Esto es opcional, pero puede ayudar a evitar errores

})
export class HomePageModule {}
