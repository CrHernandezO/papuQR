import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ApiService } from 'src/app/api.service';  // Asegúrate de importar el servicio
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  usuario: any;

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
  }

  async sendEmail() {
    if (!this.usuario.email) {
      console.error('El email del usuario está vacío.');
      this.showAlert('Error', 'No se puede enviar el email porque la dirección está vacía.');
      return;
    }
  
    // Obtener la fecha y hora actual
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.toLocaleDateString()} ${fechaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  
    // Construir los parámetros para el email
    const templateParams = {
      user_name: this.usuario.nombre, // Nombre del usuario
      user_rut: this.usuario.rut,    // RUT del usuario
      message: `RUT: ${this.usuario.rut}, Fecha y Hora: ${fechaFormateada}`, // Mensaje dinámico
      user_email: this.usuario.email // email del usuario autenticado
    };
  
    try {
      // Enviar email usando EmailJS
      const result = await emailjs.send(
        'service_lwu745r',   // Reemplaza con tu Service ID
        'template_1d449n2',  // Reemplaza con tu Template ID
        templateParams,
        '06juL3Kq6d_ohh3OC'  // Reemplaza con tu Public Key
      );
  
      console.log('email enviado:', result.text);
      this.showAlert('email enviado', 'Se envió un email de confirmación de asistencia.');
    } catch (error) {
      console.error('Error al enviar el email:', error);
      this.showAlert('Error', 'Hubo un problema al enviar el email.');
    }
  }

  // Función para escanear códigos QR o barras
  async scanCode() {
    try {
      await BarcodeScanner.prepare();
      const scanResult = await BarcodeScanner.startScan();
  
      if (scanResult.hasContent) {
        console.log('Resultado del escaneo:', scanResult.content);
  
        // Supongamos que actualizamos la asistencia aquí
        const result = await this.apiService.updateAttendance(scanResult.content, 'presente');
  
        if (result) {
          // Enviar email al usuario
          await this.sendEmail();
  
          // Mostrar mensaje de éxito
          this.showAlert('Asistencia', '¡Has quedado presente y se envió un email de confirmación!');
        } else {
          this.showAlert('Error', 'No se pudo actualizar tu asistencia.');
        }
      } else {
        this.showAlert('Escaneo Cancelado', 'No se detectó ningún contenido.');
      }
    } catch (err) {
      console.error('Error al escanear:', err);
      this.showAlert('Error', 'Hubo un error al intentar escanear el código.');
    }
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
