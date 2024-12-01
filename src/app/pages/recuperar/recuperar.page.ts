import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';  // Importar ApiService
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  correo: string = "";
  correoValido: boolean = true;
  titulo: string = "Restablecer Contraseña";

  constructor(
    private apiService: ApiService,  // Usar ApiService para interactuar con la API
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  async recuperar() {
    // Verificar si el correo existe en la base de datos
    const usuario = await this.apiService.recoverPassword(this.correo);

    if (usuario) {
      // Lógica para restablecer la contraseña (por ejemplo, enviar un correo con la nueva contraseña)
      // Aquí se debe integrar la lógica de backend para generar y enviar la nueva contraseña al correo del usuario

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
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'ERROR! El usuario no existe.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
}
