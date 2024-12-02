import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ApiService } from 'src/app/api.service';  // Asegúrate de importar el servicio
import { isPlatform } from '@ionic/angular';
@Component({
  selector: 'app-bienvenida',
  templateUrl: 'bienvenida.page.html',
  styleUrls: ['bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {
  usuario: any;
  plataforma: string = '';
  constructor(
    private navController: NavController,
    private alertController: AlertController,
    private apiService: ApiService  // Inyectamos ApiService
  ) {}

  ngOnInit() {
    
    // Usar ApiService para obtener el usuario autenticado
    const user = this.apiService.getAuthenticatedUser();
    
    if (user) {
      this.usuario = user;  // Asignar usuario autenticado
      console.log(this.usuario);  // Verificación
    } else {
      console.log('No se encontró un usuario autenticado.');
      this.navController.navigateRoot('/login');  // Redirigir al login si no hay usuario
    }
    if (isPlatform('ios')) {
      this.plataforma = 'iOS';
    } else if (isPlatform('android')) {
      this.plataforma = 'Android';
    } else {
      this.plataforma = 'Web/PWA';
    }

    console.log('Plataforma detectada:', this.plataforma);
  }

  // Función para escanear códigos QR o barras
  scanCode() {
    BarcodeScanner.prepare() // Prepara el escáner
      .then(() => {
        return BarcodeScanner.startScan(); // Comienza el escaneo
      })
      .then((scanResult) => {
        if (scanResult.hasContent) {
          console.log('Resultado del escaneo:', scanResult.content);
          this.showAlert('Resultado del Escaneo', scanResult.content);  // Mostrar alerta con resultado
        } else {
          console.log('Escaneo cancelado o sin contenido.');
          this.showAlert('Escaneo Cancelado', 'No se detectó ningún contenido.'); // Mensaje si no hay contenido
        }
      })
      .catch(err => {
        console.error('Error al escanear:', err);
        this.showAlert('Error', 'Hubo un error al intentar escanear el código.');
      });
  }

  // Función para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Función de logout
  logout() {
    // Limpiar la sesión desde el ApiService
    this.apiService.clearAuthenticatedUser();  // Limpiar la sesión
    this.navController.navigateRoot('/login');  // Redirigir al login
  }
}
