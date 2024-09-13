import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(  private animationController: AnimationController
  ) { }

  ngOnInit() {
  }

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
}
