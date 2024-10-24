import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Storage } from '@ionic/storage-angular';  // Importar Storage

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit{

  persona: FormGroup;
  bienvenida: string = 'Bienvenido, por favor complete el formulario.';
  titulo: string = 'Registro de Usuario'; 

  ngOnInit() {
  }

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,  
    private navCtrl: NavController,
    private usuarioService: UsuarioService,
    private router: Router,
    private storage: Storage  // Inyectar Storage
  ) {
    this.initStorage();  // Inicializar el storage

    this.persona = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\\.cl$')]],  
      numero_celular: ['', [Validators.required, Validators.pattern('^\\+569[0-9]{8}$')]], 
      rut: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10), this.validarRut.bind(this)]],  
      nombre: ['', [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$")]], 
      apellido: ['', [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$")]], 
      contraseña: ['',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]],
      rep_contraseña: ['',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]],
      fecha_nacimiento: ['', [Validators.required, this.validarEdadMinima]],
      tiene_vehiculo: ['', Validators.required],
      marca_vehiculo: [''],
      modelo_vehiculo: [''],
      cant_asientos: [''],
      patente: [''],
      anio_inscripcion: ['']
    }, { validators: this.passwordsCoinciden });

    this.persona.get('tiene_vehiculo')?.valueChanges.subscribe(value => {
      if (value === 'si') {
        this.persona.get('marca_vehiculo')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z]+$')]);
        this.persona.get('modelo_vehiculo')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z]+$')]);
        this.persona.get('cant_asientos')?.setValidators([Validators.required, Validators.min(4), Validators.max(32),Validators.pattern('^[0-9]+$')]);
        this.persona.get('patente')?.setValidators([Validators.required, Validators.pattern('^[A-Za-z]{2}[A-Za-z]{2}[0-9]{2}$')]); // Patente formato chileno
        this.persona.get('anio_inscripcion')?.setValidators([Validators.required, Validators.min(2012), Validators.max(2024)]); // Año de inscripción entre 2012 y 2024
      } else { 
        this.persona.get('marca_vehiculo')?.clearValidators();
        this.persona.get('modelo_vehiculo')?.clearValidators();
        this.persona.get('cant_asientos')?.clearValidators();
        this.persona.get('patente')?.clearValidators();
        this.persona.get('anio_inscripcion')?.clearValidators();
      }
      this.persona.get('marca_vehiculo')?.updateValueAndValidity();
      this.persona.get('modelo_vehiculo')?.updateValueAndValidity();
      this.persona.get('cant_asientos')?.updateValueAndValidity();
      this.persona.get('patente')?.updateValueAndValidity();
      this.persona.get('anio_inscripcion')?.updateValueAndValidity();
    });
  }

  // Inicializar el Storage
  async initStorage() {
    await this.storage.create();
  }

  // Validar que las contraseñas coincidan
  passwordsCoinciden(formGroup: AbstractControl) {
    const contraseña = formGroup.get('contraseña')?.value;
    const repContraseña = formGroup.get('rep_contraseña')?.value;
    return contraseña === repContraseña ? null : { noCoinciden: true };
  }

  // Validar que la fecha de nacimiento sea de al menos 18 años
  validarEdadMinima(control: AbstractControl) {
    const fechaNacimiento = moment(control.value);
    const edad = moment().diff(fechaNacimiento, 'years');
    return edad >= 18 ? null : { menorDeEdad: true };
  }

  // Función para mostrar un Alert con mensaje fijo y botón de redirección
  async mostrarAlerta() {
    const alert = await this.alertController.create({
      header: 'Cuenta Creada!',
      message: 'Tu cuenta ha sido creada correctamente.',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.router.navigate(['/login']);  // Redirigir a login cuando el usuario presione "Aceptar"
        }
      }]
    });
    await alert.present();
  }

  public async registroUsuario(): Promise<void> {
    try {
      const usuarioData = { ...this.persona.value };

      usuarioData.fecha_nacimiento = moment(usuarioData.fecha_nacimiento).format('YYYY-MM-DD');
      
      if (usuarioData.tiene_vehiculo === 'si') {
        usuarioData.tipo = 'Conductor';  
      } else {
        usuarioData.tipo = 'Alumno'; 
      }
  
      const usuariosExistentes = await this.storage.get('usuarios') || [];
  
      const usuarioExistente = usuariosExistentes.find((user: any) => user.rut === usuarioData.rut);
  
      if (!usuarioExistente) {
        usuariosExistentes.push(usuarioData);
        await this.storage.set('usuarios', usuariosExistentes);  // Guardar los usuarios en Storage
        console.log("El Usuario se ha creado con éxito!");
  
        this.mostrarNotificacion('Usuario creado', 'El usuario ha sido registrado con éxito.', true);
      } else {
        this.mostrarNotificacion('Error', 'El usuario con este RUT ya existe.', false);
      }
    } catch (error) {
      console.log("Ocurrió un error durante el registro del usuario", error);
    }
  }
  
  private async mostrarNotificacion(header: string, message: string, redirigir: boolean): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          if (redirigir) {
            this.navCtrl.navigateRoot('/login');
          }
        }
      }]
    });
  
    await alert.present();
  }

  // Método para calcular el dígito verificador del RUT
  calcularDigitoVerificador(rut: string): string {
    let rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
  
    if (!/^\d+$/.test(rutLimpio)) {
      throw new Error('RUT inválido');
    }
  
    let suma = 0;
    let multiplicador = 2;
  
    for (let i = rutLimpio.length - 1; i >= 0; i--) {
      suma += parseInt(rutLimpio.charAt(i), 10) * multiplicador;
      multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }
  
    const resto = suma % 11;
    const digito = 11 - resto;
  
    if (digito === 10) {
      return 'K';
    } else if (digito === 11) {
      return '0';
    } else {
      return digito.toString();
    }
  }

  // Validar el RUT ingresado
  validarRut(control: AbstractControl): { [key: string]: boolean } | null {
    const rutCompleto = control.value;
    
    if (!rutCompleto || !/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto)) {
      return { rutInvalido: true };
    }

    const [rut, digito] = rutCompleto.split('-');
    const digitoVerificadorCalculado = this.calcularDigitoVerificador(rut);

    if (digito.toLowerCase() !== digitoVerificadorCalculado.toLowerCase()) {
      return { rutInvalido: true };
    }

    return null;
  }
}
