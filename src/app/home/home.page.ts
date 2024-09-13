import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  /* Objeto JSON para usuario */
  user = {
    username: '',
    password: '',
  };
  /* Mensaje de respuesta */
  mensaje = '';
  /* Estado del spinner */
  spinner = false;
  /* Estado del toggle "Recuérdame" */
  rememberMe = false;

  constructor(
    private router: Router,
    private animationController: AnimationController
  ) {}

  ngAfterContentInit() {
    this.animarLogin();
  }

  animarLogin() {
    const loginIcon = document.querySelector('.login img') as HTMLElement;

    const animacion = this.animationController
      .create()
      .addElement(loginIcon)
      .duration(4000) // Ajusta la duración de la animación
      .iterations(Infinity)
      .keyframes([
        { offset: 0, transform: 'translateX(-100px)' },
        { offset: 0.5, transform: 'translateX(100px)' },
        { offset: 1, transform: 'translateX(-100px)' },
      ]);

    animacion.play();
  }

  /* Función para mostrar el spinner */
  mostrarSpinner() {
    this.spinner = true;

    // Ocultar el spinner después de 3 segundos (simulación de carga)
    setTimeout(() => {
      this.spinner = false;
    }, 3000);
  }

  /* Validación del login */
  validar() {
    this.mostrarSpinner(); // Muestra el spinner

    if (this.user.username.length !== 0) {
      if (this.user.password.length !== 0) {
        this.mensaje = 'Conexión exitosa';
        let navigationExtras: NavigationExtras = {
          state: {
            username: this.user.username,
            password: this.user.password,
            rememberMe: this.rememberMe, // Añadir el estado del toggle
          },
        };

        setTimeout(() => {
          this.router.navigate(['/bienvenida'], navigationExtras);
        }, 3000); // Simula el retraso para la carga
      } else {
        this.mensaje = 'Contraseña vacía';
        this.spinner = false; // Oculta el spinner si hay un error
      }
    } else {
      this.mensaje = 'Usuario vacío';
      this.spinner = false; // Oculta el spinner si hay un error
    }
  }
}
