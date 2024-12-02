import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/api.service'; // Importar ApiService

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  persona: FormGroup;
  bienvenida: string = 'Bienvenido, por favor complete el formulario.';
  titulo: string = 'Registro de Usuario'; 

  ngOnInit() {}

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,  
    private navCtrl: NavController,
    private apiService: ApiService, // Inyectar ApiService
    private router: Router
  ) {
    this.persona = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\\.cl$')]],  
      numero_celular: ['', [Validators.required, Validators.pattern('^\\+569[0-9]{8}$')]], 
      rut: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10), this.validarRut.bind(this)]],  
      nombre: ['', [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$")]], 
      apellido: ['', [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$")]], 
      password: ['',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]], 
      re_password: ['',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]], 
      fecha_nacimiento: ['', [Validators.required, this.validarEdadMinima]],
      esprofesor: ['', Validators.required],
      asignatura: [''],
      cant_alum: [''],
      anio_inscripcion: [''],
      asistencia: ['ausente']
    }, { validators: this.passwordsCoinciden });

    // Lógica para validaciones dinámicas
    this.persona.get('esprofesor')?.valueChanges.subscribe(value => {
      if (value === 'si') {
        this.persona.get('asignatura')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z]+$')]);
        this.persona.get('cant_alum')?.setValidators([Validators.required, Validators.min(4), Validators.max(32), Validators.pattern('^[0-9]+$')]);
        this.persona.get('anio_inscripcion')?.setValidators([Validators.required, Validators.min(2012), Validators.max(2024)]);
      } else { 
        this.persona.get('asignatura')?.clearValidators();
        this.persona.get('cant_alum')?.clearValidators();
        this.persona.get('anio_inscripcion')?.clearValidators();
      }
      this.persona.get('asignatura')?.updateValueAndValidity();
      this.persona.get('cant_alum')?.updateValueAndValidity();
      this.persona.get('anio_inscripcion')?.updateValueAndValidity();
    });
  }

  // Validar que las passwords coincidan
  passwordsCoinciden(formGroup: AbstractControl) {
    const password = formGroup.get( 'password')?.value;
    const re_password = formGroup.get('re_password')?.value;
    return password === re_password ? null : { noCoinciden: true };
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

  // Función para registrar al usuario
  public async registroUsuario(): Promise<void> {
    try {
      const usuarioData = { ...this.persona.value };
      usuarioData.fecha_nacimiento = moment(usuarioData.fecha_nacimiento).format('YYYY-MM-DD');
      
      if (usuarioData.esprofesor === 'si') {
        usuarioData.tipo = 'Profesor';  
      } else {
        usuarioData.tipo = 'Alumno'; 
      }

      // Usar ApiService para registrar el usuario en el servidor
      this.apiService.registerUser(usuarioData).subscribe(
        async (response) => {
          console.log("El Usuario se ha creado con éxito!", response);
          this.mostrarNotificacion('Usuario creado', 'El usuario ha sido registrado con éxito.', true);
        },
        (error) => {
          console.error('Error al registrar usuario', error);
          this.mostrarNotificacion('Error', 'Hubo un error al registrar al usuario.', false);
        }
      );
    } catch (error) {
      console.log("Ocurrió un error durante el registro del usuario", error);
    }
  }

  // Método para mostrar notificaciones de éxito o error
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
