import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { elementAt } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private _storage: Storage | null = null;
  viajes: any[] = [];

  constructor(private storage: Storage) {

  }

  // Crear un nuevo viaje y guardar en el almacenamiento
  public async createViaje(viaje: any): Promise<boolean> {
    if (this.obtenerViaje(viaje.id) === undefined) {
      this.viajes.push(viaje);
      await this._storage?.set('viajes', this.viajes);
      return true;
    }
    return false;
  }

  // Actualizar un viaje y guardar en el almacenamiento
  public async updateViaje(id: number, newViaje: any): Promise<boolean> {
    const indice = this.viajes.findIndex(via => via.id === id);
    if (indice === -1) {
      return false;
    }
    this.viajes[indice] = newViaje;
    await this._storage?.set('viajes', this.viajes);
    return true;
  }

  // Eliminar un viaje y actualizar el almacenamiento
  public async deleteViaje(id: number): Promise<boolean> {
    const indice = this.viajes.findIndex(via => via.id === id);
    if (indice === -1) {
      return false;
    }
    this.viajes.splice(indice, 1);
    await this._storage?.set('viajes', this.viajes);
    return true;
  }

  // Obtener un viaje por rut
  public obtenerViaje(id: number): any {
    return this.viajes.find(via => via.id === id);
  }

  // Obtener todos los viajes
  public async obtenerViajes(): Promise<any[]> {
    return await this.storage.get('viajes');
  }

}
