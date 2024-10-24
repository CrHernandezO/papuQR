import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  usuario: any;

  constructor(private navController: NavController) {}

  ngOnInit(){
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    console.log(this.usuario);
  }

  logout(){
    localStorage.removeItem('usuario');
    this.navController.navigateRoot('/login');
  }

}
