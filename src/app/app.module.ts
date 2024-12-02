import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from "@ionic/storage-angular";
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { getConfig } from 'src/app/config'; // Importa la configuración dinámica

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
     IonicModule.forRoot(getConfig()),
     AppRoutingModule,
     IonicStorageModule.forRoot(),
     HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },    BarcodeScanner // Añádelo aquí como proveedor
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
