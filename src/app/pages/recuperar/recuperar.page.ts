import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  
  constructor(private usuarioService: UsuarioService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  //NgModel
  correo: string = "";
  correoValido: boolean = true;
  titulo: string = "Restablecer Contraseña";

  async recuperar() {
    if (await this.usuarioService.recuperarUsuario(this.correo)) {
      // Mostrar notificación de éxito
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Revisa tu correo para encontrar la nueva contraseña.',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              this.router.navigate(['/login']);
            }
          }
        ]
      });
      await alert.present();
    } else {
      // Mostrar notificación de error
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'ERROR! El usuario no existe!',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }  

}
