import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {
  persona: FormGroup;
  bienvenida: string = 'Bienvenido, por favor complete el formulario.';
  titulo: string = 'Administrar Usuarios';
  usuarios: any[] = [];
  editando: boolean = false;
  rutUsuarioAEditar: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private apiService: ApiService,
    private router: Router
  ) {
    this.persona = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        numero_celular: ['', [Validators.required, Validators.pattern('^\\+569[0-9]{8}$')]],
        rut: ['', [Validators.required, this.validarRut.bind(this)]],
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        re_password: ['', Validators.required],
        fecha_nacimiento: ['', [Validators.required, this.validarEdadMinima]],
        esprofesor: ['', Validators.required],
        asignatura: ['', []],
        cant_alum: ['', []],
        anio_inscripcion: ['', []],
      },
      { validators: this.passwordsCoinciden }
    );
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  passwordsCoinciden(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const rePassword = formGroup.get('re_password')?.value;
    return password === rePassword ? null : { noCoinciden: true };
  }

  validarEdadMinima(control: AbstractControl) {
    const fechaNacimiento = moment(control.value);
    const edad = moment().diff(fechaNacimiento, 'years');
    return edad >= 18 ? null : { menorDeEdad: true };
  }

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

  calcularDigitoVerificador(rut: string): string {
    let suma = 0;
    let multiplicador = 2;
    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut.charAt(i), 10) * multiplicador;
      multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }
    const resto = suma % 11;
    const digito = 11 - resto;
    return digito === 10 ? 'K' : digito === 11 ? '0' : digito.toString();
  }

  cargarUsuarios() {
    this.apiService.getUserByRut().subscribe(
      (response: any[]) => {
        this.usuarios = response; // Asigna directamente los usuarios obtenidos
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
        this.usuarios = [];
      }
    );
  }

  guardarCambios() {
    const usuarioData = { ...this.persona.value };
    usuarioData.fecha_nacimiento = moment(usuarioData.fecha_nacimiento).format('YYYY-MM-DD');

    if (this.editando) {
      this.apiService.updateUser(this.rutUsuarioAEditar!, usuarioData).subscribe(
        () => {
          console.log('Usuario actualizado');
          this.cargarUsuarios();
          this.resetFormulario();
        },
        (error) => console.error('Error al actualizar usuario:', error)
      );
    } else {
      this.apiService.registerUser(usuarioData).subscribe(
        () => {
          console.log('Usuario registrado');
          this.cargarUsuarios();
          this.resetFormulario();
        },
        (error) => console.error('Error al registrar usuario:', error)
      );
    }
  }

  eliminarUsuario(rut: string) {
    const usuario = this.usuarios.find((u) => u.rut === rut); // Encuentra al usuario por rut
    if (usuario && usuario.id) {
      this.apiService.deleteUser(usuario.id).subscribe(
        () => {
          console.log('Usuario eliminado');
          this.cargarUsuarios();
        },
        (error) => console.error('Error al eliminar usuario:', error)
      );
    } else {
      console.warn('No se encontró un usuario válido para eliminar.');
    }
  }

  resetFormulario() {
    this.persona.reset();
    this.editando = false;
    this.rutUsuarioAEditar = null;
  }

  modificarUsuario(usuario: any) {
    this.editando = true;
    this.rutUsuarioAEditar = usuario.rut;
    this.persona.patchValue(usuario);
  }

  registroUsuario() {
    if (this.persona.valid) {
      console.log('Formulario válido, procesando registro...');
      this.guardarCambios();
    } else {
      console.log('Formulario no válido');
    }
  }

  limpiarFormulario() {
    this.resetFormulario();
  }
}
