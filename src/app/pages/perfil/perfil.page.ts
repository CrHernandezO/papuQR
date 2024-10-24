import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';  
import { AlertController } from '@ionic/angular';  

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = {};
  usuarios: any[] = [];  
  editando: boolean = false;
  tieneVehiculoCheckbox: boolean = false; // Variable booleana para manejar el estado del checkbox

  constructor(
    private router: Router,
    private storage: Storage,  
    private alertController: AlertController  
  ) { }

  async ngOnInit() {
    await this.initStorage();

    this.usuarios = await this.storage.get('usuarios') || [];

    const usuarioLogeado = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuarioLogeado && usuarioLogeado.nombre) {
      this.usuario = usuarioLogeado;
      this.tieneVehiculoCheckbox = this.usuario.tiene_vehiculo === 'si'; // Inicializar el checkbox
    } else {
      console.log('Error: No se encontró usuario en sesión en localStorage.');
      this.router.navigate(['/login']);  
    }

    const usuarioStorage = await this.storage.get('usuario');
    if (usuarioStorage && usuarioStorage.nombre) {
      this.usuario = usuarioStorage;
      this.tieneVehiculoCheckbox = this.usuario.tiene_vehiculo === 'si'; // Inicializar el checkbox desde el Storage
    }
  }

  async initStorage() {
    const storage = await this.storage.create();
    console.log('Storage inicializado:', storage);
  }

  activarEdicion() {
    this.editando = true;
  }

  toggleVehiculo(event: any) {
    this.tieneVehiculoCheckbox = event.detail.checked;
    if (this.tieneVehiculoCheckbox) {
      this.usuario.tiene_vehiculo = 'si';  // Cambiar a "si"
    } else {
      this.usuario.tiene_vehiculo = 'no';  // Cambiar a "no" y limpiar los campos
      this.limpiarDatosVehiculo();
    }
  }

  limpiarDatosVehiculo() {
    this.usuario.marca_vehiculo = '';
    this.usuario.modelo_vehiculo = '';
    this.usuario.patente = '';
    this.usuario.cant_asientos = '';
    this.usuario.anio_inscripcion = '';
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
    // Si se selecciona "No tengo auto", limpiar los campos de vehículo
    if (this.usuario.tiene_vehiculo === 'no') {
      this.usuario.tipo = 'Alumno';  // Cambiar a Alumno si no tiene vehículo
      this.limpiarDatosVehiculo();
    } else {
      this.usuario.tipo = 'Conductor';  // Cambiar a Conductor si tiene vehículo
    }

    // Guardar los cambios en localStorage
    localStorage.setItem('usuario', JSON.stringify(this.usuario));

    // Actualizar los datos del usuario en Ionic Storage
    const actualizado = await this.updateUser(this.usuario.rut, this.usuario);

    if (actualizado) {
      console.log('Usuario actualizado correctamente.');
      window.location.reload();  // Refrescar la página para aplicar los cambios
    } else {
      console.log('Error: No se pudo actualizar el usuario en la lista.');
    }

    this.editando = false;
  }

  cancelarEdicion() {
    // Restaurar los datos originales del usuario
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.usuario = usuarioLogeado;
    this.tieneVehiculoCheckbox = this.usuario.tiene_vehiculo === 'si'; // Restaurar el estado del checkbox
    this.editando = false;
  }

  async updateUser(rut: string, newUser: any): Promise<boolean> {
    const indice = this.usuarios.findIndex(usuario => usuario.rut === rut);
    if (indice === -1) {
      return false;
    }
    this.usuarios[indice] = newUser;
    await this.storage.set('usuarios', this.usuarios);  // Guardar los cambios en Ionic Storage
    return true;
  }
}
