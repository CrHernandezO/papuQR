import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // Asegúrate de que JSON Server esté corriendo
  private currentUser: any = null;  // Variable en memoria para almacenar al usuario autenticado

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
            this.currentUser = users[0]; // Guarda al usuario autenticado en memoria
            console.log('Usuario autenticado:', this.currentUser);
            return users[0]; // Retorna el primer usuario encontrado
          }
          return null; // Si no se encuentra un usuario, retorna null
        })
      );
  }

  // Recuperar contraseña
  recoverPassword(email: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map(users => (users.length > 0 ? users[0] : null)) // Retorna el usuario si existe
    );
  }
  // Obtener el perfil de usuario por ID
  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }


  // Obtener todos los usuarios si no se pasa un rut específico
  getUserByRut(rut: string = ''): Observable<any[]> {
    const url = rut ? `${this.apiUrl}/users?rut=${rut}` : `${this.apiUrl}/users`;
    return this.http.get<any[]>(url);
  }

  // Actualizar usuario por ID
  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, userData);
  }

  // Cambiar estado de asistencia
  updateAttendance(userId: string, attendance: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}`, { asistencia: attendance });
  }

  // Obtener el usuario autenticado actualmente
  getAuthenticatedUser() {
    return this.currentUser;
  }

  // Actualizar el usuario autenticado
  setAuthenticatedUser(user: any) {
    this.currentUser = user; // Solo actualiza la variable en memoria
  }

  // Limpiar la sesión del usuario autenticado
  clearAuthenticatedUser() {
    this.currentUser = null;
  }
  // ApiService

  // Eliminar usuario por ID
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

}
