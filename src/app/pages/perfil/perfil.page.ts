import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = {};
  editando: boolean = false;
  esprofesorCheckbox: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    // Obtener usuario desde ApiService en lugar de localStorage
    const usuarioLogeado = this.apiService.getAuthenticatedUser();
    if (usuarioLogeado && usuarioLogeado.rut) {
      this.usuario = usuarioLogeado;
      this.esprofesorCheckbox = this.usuario.esprofesor === 'si';
    } else {
      console.log('Error: No se encontró usuario en sesión.');
      this.router.navigate(['/login']);
    }
  }

  activarEdicion() {
    this.editando = true;
  }

  toggleProfesor(event: any) {
    this.esprofesorCheckbox = event.detail.checked;
    if (this.esprofesorCheckbox) {
      this.usuario.esprofesor = 'si';
    } else {
      this.usuario.esprofesor = 'no';
    }
  }

  async confirmarGuardado() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Quieres modificar los datos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Modificación cancelada');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.guardarCambios();
          }
        }
      ]
    });

    await alert.present();
  }
  async guardarCambios() {
    const usuarioLogeado = this.apiService.getAuthenticatedUser();
    if (usuarioLogeado && usuarioLogeado.id) {
      // Usa el ID del usuario en lugar del rut en la URL de la solicitud PUT
      const actualizado = await this.apiService.updateUser(usuarioLogeado.id, this.usuario).toPromise();
  
      if (actualizado) {
        console.log('Usuario actualizado correctamente.');
        // En lugar de recargar la página, actualiza el estado del usuario en el servicio
        this.apiService.setAuthenticatedUser(this.usuario); // Aquí asumes que tienes una función para actualizar el usuario en el servicio
  
        // Puedes mostrar un mensaje de éxito al usuario si lo deseas
      } else {
        console.log('Error: No se pudo actualizar el usuario.');
      }
  
      this.editando = false;
    } else {
      console.log('Error: No se encontró usuario autenticado.');
    }
  }
  
  cancelarEdicion() {
    // Restaurar los datos originales del usuario desde ApiService
    const usuarioLogeado = this.apiService.getAuthenticatedUser();
    if (usuarioLogeado) {
      this.usuario = usuarioLogeado;
      this.esprofesorCheckbox = this.usuario.esprofesor === 'si';
    }
    this.editando = false;
  }
}
