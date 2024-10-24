import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

//lo primero es agregar un import:
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  viaje = new FormGroup({
    id: new FormControl('',[Validators.required]),
    latitud: new FormControl('', [Validators.required]),
    longitud: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    distancia_metros: new FormControl('', [Validators.required]),
    pasajeros: new FormControl('', [Validators.required]),

  });

  //vamos a crear variable(s) para controlar el mapa:
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  latitud: number = 0;
  longitud: number = 0;
  direccion: string = "";
  distancia_metros: number = 0;
  tiempo_segundos: number = 0;

  //Simulacion de una lista de viajes ya creados: Eventualmente le Cargan datos a la lista
  viajes: any[] = [{
    "id": 1,
    "conductor": "Lalo Cura",
    "asientos_disponibles": 4,
    "nombre_destino": "Santa Isabel Sur",
    "latitud": -33.59,
    "longitud": -70.53,
    "distancia_metros": 5000,
    "tiempo_segundos": 900,
    "estado_viaje": "pendiente",
    "pasajeros": []
    },{
      "id": 2,
      "conductor": "Elba Lazo",
      "asientos_disponibles": 1,
      "nombre_destino": "Santa Isabel Sur",
      "latitud": -33.59,
      "longitud": -70.53,
      "distancia_metros": 5000,
      "tiempo_segundos": 900,
      "estado_viaje": "pendiente",
      "pasajeros": [17888444, 15999555]
    },{
      "id": 3,
      "conductor": "Elvis Teck",
      "asientos_disponibles": 0,
      "nombre_destino": "Santa Isabel Sur",
      "latitud": -33.59,
      "longitud": -70.53,
      "distancia_metros": 5000,
      "tiempo_segundos": 900,
      "estado_viaje": "termindo",
      "pasajeros": [14888555]
    },{
      "id": 4,
      "conductor": "Armando Casas",
      "asientos_disponibles": 0,
      "nombre_destino": "Santa Isabel Sur",
      "latitud": -33.59,
      "longitud": -70.53,
      "distancia_metros": 5000,
      "tiempo_segundos": 900,
      "estado_viaje": "pendiente",
      "pasajeros": [17888999,15444888,16555444,15888888]
    }
  ];

  constructor(private viajeService: ViajeService) { }

  ngOnInit() {
    this.initMap();
  }

  async registroViaje(){
    if (await this.viajeService.createViaje(this.viaje.value)){
      alert("Viaje creado")
    }
    alert("ERROR! viaje no creado")
  }

  initMap(){
    //ACA CARGAMOS E INICIALIZAMOS EL MAPA:
    this.map = L.map("map_html").locate({setView:true, maxZoom:16});
    //this.map = L.map("map_html").setView([-33.608552227594245, -70.58039819211703],16);
    
    //ES LA PLANTILLA PARA QUE SEA VEA EL MAPA:
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.map.on('locationfound', (e)=>{
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
    });

    //VAMOS A AGREGAR UN BUSCADOR DE DIRECCIONES EN EL MAPA:
    this.geocoder = G.geocoder({
      placeholder: "Ingrese dirección a buscar",
      errorMessage: "Dirección no encontrada"
    }).addTo(this.map);

    //VAMOS A REALIZAR UNA ACCIÓN CON EL BUSCADOR, CUANDO OCURRA ALGO CON EL BUSCADOR:
    this.geocoder.on('markgeocode', (e)=>{
      this.latitud = e.geocode.properties['lat'];
      this.longitud = e.geocode.properties['lon'];
      this.direccion = e.geocode.properties['display_name'];

      //le vamos a agregar un radio a la busqueda.
      var circulo = L.circle([this.latitud, this.longitud],{
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
      }).addTo(this.map!);

      if(this.map){
        L.Routing.control({
          waypoints: [L.latLng(-33.59837122676798, -70.57877634597855),
                      L.latLng(this.latitud,this.longitud)],
          fitSelectedRoutes: true,
        }).on('routesfound', (e)=>{
          this.distancia_metros = e.routes[0].summary.totalDistance;
          this.tiempo_segundos = e.routes[0].summary.totalTime;
        }).addTo(this.map);
      }
    });

  }

}
