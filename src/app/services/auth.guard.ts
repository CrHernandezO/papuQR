import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';  // Asegúrate de que el servicio esté importado

export const authGuard: CanActivateFn = async (route, state) => {
  const navController = inject(NavController);
  const apiService = inject(ApiService);

  // Verificar si hay un usuario autenticado desde el ApiService
  const user = apiService.getAuthenticatedUser(); 

  if (user) {
    // Si el usuario está autenticado, permitir el acceso
    return true;
  } else {
    // Si no está autenticado, redirigir al login
    navController.navigateRoot('/login');
    return false;
  }
};
