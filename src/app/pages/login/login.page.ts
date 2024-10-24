import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  titulo: string = "Iniciar Sesión / TeLlevo App";
 
  constructor(private router: Router, 
    private usuarioService: UsuarioService, 
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'crescent', 
      duration: 3000 
    });
    await loading.present();
  
    const loginSuccess = await this.usuarioService.login(this.email, this.password);
  
    await loading.dismiss();
  
    if (loginSuccess) {
      this.router.navigate(['/home']);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El Correo o la Contraseña son Incorrectos!',
        buttons: ['Aceptar']
      });
      await alert.present();
  
      // Limpiar los campos del formulario
      this.email = '';
      this.password = '';
    }
  }

  //NgModel
  email: string = "";
  password: string = "";
}


