import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ApiService } from 'src/app/api.service'; 
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-bienvenida',
  templateUrl: 'bienvenida.page.html',
  styleUrls: ['bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {
  usuario: any;
  plataforma: string = '';
  usuarios: any[] = []; // Lista de usuarios

  constructor(
    private navController: NavController,
    private alertController: AlertController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const user = this.apiService.getAuthenticatedUser();

    if (user) {
      this.usuario = user;
      if (user.rol === 'profesor') {
        this.cargarUsuarios(); // Cargar lista de usuarios si es profesor
      }
    } else {
      this.navController.navigateRoot('/login');
    }

    this.plataforma = isPlatform('ios') ? 'iOS' : isPlatform('android') ? 'Android' : 'Web/PWA';
  }

  cargarUsuarios() {
    this.apiService.getUsuarios().subscribe(
      (data: any) => {
        this.usuarios = data.map((user: any) => ({
          rut: user.rut,
          asistencia: user.asistencia || 'ausente',
        }));
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
        this.showAlert('Error', 'No se pudo cargar la lista de usuarios.');
      }
    );
  }

  async onNutriaClick() {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: 'No aprietes aceptar o la nutria se comerá el proyecto.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.logout(); // Recarga la página y regresa al login
          },
        },
      ],
    });

    await alert.present();
  }

  scanCode() {
    BarcodeScanner.prepare()
      .then(() => BarcodeScanner.startScan())
      .then((scanResult) => {
        if (scanResult.hasContent) {
          this.showAlert('Resultado del Escaneo', scanResult.content);
        } else {
          this.showAlert('Escaneo Cancelado', 'No se detectó ningún contenido.');
        }
      })
      .catch((err) => {
        console.error('Error al escanear:', err);
        this.showAlert('Error', 'Hubo un error al intentar escanear el código.');
      });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  logout() {
    this.apiService.clearAuthenticatedUser();
    this.navController.navigateRoot('/login');
  }
}
