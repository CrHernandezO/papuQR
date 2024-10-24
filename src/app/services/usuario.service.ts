import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { elementAt } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private _storage: Storage | null = null;
  usuarios: any[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // Inicializar el almacenamiento
    const storage = await this.storage.create();
    this._storage = storage;

    // Cargar usuarios almacenados si existen
    const storedUsers = await this._storage.get('usuarios');
    if (!storedUsers) {
      // Si no hay usuarios, agregar uno por defecto
      const usuarioPredeterminado = {
        tipo: 'Administrador',
        correo: 'admin@duocuc.cl',
        numero_celular: '+56912345678',
        rut: '12345678-9',
        nombre: 'alan',
        apellido: 'gajardo',
        contraseña: '12345678',
        rep_contraseña: '12345678',
        fecha_nacimiento: '1999-04-25',
        tiene_vehiculo: 'si',
        marca_vehiculo: 'renault',
        modelo_vehiculo: 'symbol',
        cant_asientos: '4',
        patente: 'GTDB20',
        anio_inscripcion: '2014'
      };

      // Guardar el usuario predeterminado en el almacenamiento
      this.usuarios.push(usuarioPredeterminado);
      await this._storage.set('usuarios', this.usuarios);
    } else {
      // Si ya existen usuarios, cargarlos
      this.usuarios = storedUsers;
    }
  }

  // Crear un nuevo usuario y guardar en el almacenamiento
  public async createUser(usuario: any): Promise<boolean> {
    if (this.obtenerUsuario(usuario.rut) === undefined) {
      this.usuarios.push(usuario);
      await this._storage?.set('usuarios', this.usuarios);
      return true;
    }
    return false;
  }

  // Actualizar un usuario y guardar en el almacenamiento
  public async updateUser(rut: string, newUser: any): Promise<boolean> {
    const indice = this.usuarios.findIndex(usuario => usuario.rut === rut);
    if (indice === -1) {
      return false;
    }
    this.usuarios[indice] = newUser;
    await this._storage?.set('usuarios', this.usuarios);
    return true;
  }

  // Eliminar un usuario y actualizar el almacenamiento
  public async deleteUser(rut: string): Promise<boolean> {
    const indice = this.usuarios.findIndex(usuario => usuario.rut === rut);
    if (indice === -1) {
      return false;
    }
    this.usuarios.splice(indice, 1);
    await this._storage?.set('usuarios', this.usuarios);
    return true;
  }

  // Obtener un usuario por rut
  public obtenerUsuario(rut: string): any {
    return this.usuarios.find(usuario => usuario.rut === rut);
  }

  // Obtener todos los usuarios
  public async obtenerUsuarios(): Promise<any[]> {
    const storedUsers = await this._storage?.get('usuarios');
    return storedUsers || this.usuarios;
  }

  public async login(correo: string, contraseña: string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    const usu = usuarios.find(elemento=> elemento.correo==correo && elemento.contraseña==contraseña);
    if(usu){
      localStorage.setItem("usuario", JSON.stringify(usu));
      return true;
    }
    return false;
  }

  public async recuperarUsuario(correo:string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(elemento=> elemento.correo == correo);
  }
}
