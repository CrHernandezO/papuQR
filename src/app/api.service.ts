import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // Asegúrate de que JSON Server esté corriendo
  private currentUser: any = null;  // Variable para almacenar al usuario autenticado

  constructor(private http: HttpClient) {}

  // Registro de usuario
  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  // Login de usuario
  loginUser(credentials: { email: string; password: string }): Observable<any> {
    if (!credentials.email || !credentials.password) {
      return new Observable(observer => {
        observer.next(null); // Devuelve null si los datos son inválidos
        observer.complete();
      });
    }

    return this.http
      .get<any[]>(`${this.apiUrl}/users?email=${credentials.email}&password=${credentials.password}`)
      .pipe(
        map(users => {
          if (users.length > 0) {
            this.currentUser = users[0];  // Guarda al usuario autenticado
            console.log('Usuario autenticado:', this.currentUser);
            return users[0];  // Retorna el primer usuario
          }
          return null; // Si no se encuentra un usuario, retorna null
        })
      );
  }

  // Obtener perfil de usuario por ID
  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  // Recuperar contraseña (simulado con JSON Server)
  recoverPassword(email: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map(users => (users.length > 0 ? users[0] : null)) // Retorna el usuario si existe
    );
  }


  // Obtener un usuario por su rut
  getUserByRut(rut: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?rut=${rut}`).pipe(
      map(users => users.length > 0 ? users[0] : null)  // Si existe un usuario, lo retornamos, sino null
    );
  }

  // api.service.ts
  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, userData);
  }



  // Función para obtener el usuario autenticado
  getAuthenticatedUser() {
    return this.currentUser;
  }

  // Función para actualizar el usuario autenticado
  setAuthenticatedUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('usuario', JSON.stringify(user));  // Guarda el usuario en localStorage si deseas mantener la sesión
  }
  // Limpiar la sesión del usuario
  clearAuthenticatedUser() {
    this.currentUser = null;
  }


}
