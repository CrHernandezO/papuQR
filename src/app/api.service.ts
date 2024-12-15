import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //cambiar por ip
  private apiUrl = 'https://8pf1zfpw-3000.brs.devtunnels.ms/users';  // Usar la IP local de tu máquina
  private currentUser: any = null;  // Variable en memoria para almacenar al usuario autenticado

  constructor(private http: HttpClient) {}
  getUsuarios() {
    return this.http.get(this.apiUrl);
  }
  registerUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);  // Solo usar `this.apiUrl`
  }
  

  // Login de usuario
  loginUser(credentials: { email: string; password: string }): Observable<any> {
    if (!credentials.email || !credentials.password) {
      console.error('Campos de login vacíos:', credentials);  // Registra los valores de los campos vacíos
      return new Observable(observer => {
        observer.next(null); 
        observer.complete();
      });
    }
  
    return this.http
      .get<any[]>(`${this.apiUrl}?email=${credentials.email}&password=${credentials.password}`)
      .pipe(
        map(users => {
          if (users.length > 0) {
            this.currentUser = users[0];
            console.log('Usuario autenticado:', this.currentUser);
            return users[0]; 
          }
          return null; 
        }),
        catchError((error) => {
          console.error('Error en loginUser:', error);  // Registra el error completo
          if (error instanceof ErrorEvent) {
            console.error('Error en cliente:', error.error.message);  // Registra errores del cliente
          } else {
            console.error('Error en servidor:', error.status, error.message);  // Registra errores del servidor
          }
          return throwError(error);  // Usa throwError en lugar de Observable.throw
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
