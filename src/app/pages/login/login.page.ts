import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service'; // Inyectar ApiService

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  titulo: string = "Iniciar Sesión";

  // NgModel para los campos de email y password
  email: string = "";
  password: string = "";

  constructor(
    private router: Router, 
    private apiService: ApiService, // Inyectar ApiService
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {}
  async login() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'crescent',
      duration: 3000,
    });
    await loading.present();
  
    const credentials = {
      email: this.email,
      password: this.password,
    };
  
    // Validar si los campos no están vacíos
    if (!credentials.email || !credentials.password) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor ingresa un correo y una contraseña.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
  
    // Llamar al servicio para realizar el login
    this.apiService.loginUser(credentials).subscribe(
      async (user) => {
        await loading.dismiss();
  
        if (user) {
          // Almacenar usuario en ApiService
          console.log('Login exitoso. Redirigiendo a /home...');
          this.router.navigate(['/home']); // Redirigir a home
        } else {
          // Si no existe, mostrar una alerta de error
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'El Correo o la Contraseña son Incorrectos!',
            buttons: ['Aceptar'],
          });
          await alert.present();
  
          // Limpiar los campos del formulario
          this.email = '';
          this.password = '';
        }
      },
      async (error) => {
        console.error('Error en el login:', error);
        await loading.dismiss();
  
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Ocurrió un error al intentar iniciar sesión.',
          buttons: ['Aceptar'],
        });
        await alert.present();
      }
    );
  }
  
  
}  