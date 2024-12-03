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
  
    console.log('Intentando iniciar sesión con:', credentials);  // Log los datos enviados
  
    this.apiService.loginUser(credentials).subscribe(
      async (user) => {
        await loading.dismiss();
        if (user) {
          console.log('Login exitoso. Redirigiendo a /home...');
          this.router.navigate(['/home']);
        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'El Correo o la Contraseña son Incorrectos!',
            buttons: ['Aceptar'],
          });
          await alert.present();
          this.email = '';
          this.password = '';
        }
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error en el login:', error);  // Error detallado en la consola
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