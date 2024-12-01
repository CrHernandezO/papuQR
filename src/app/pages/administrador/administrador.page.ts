import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Storage } from '@ionic/storage-angular';  // Importar Storage

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  persona: FormGroup;
  bienvenida: string = 'Bienvenido, por favor complete el formulario.';
  titulo: string = 'Registro de Usuario'; 
  usuarios: any[] = []; // Variable para almacenar la lista de usuarios
  editando: boolean = false;  // Indicador para saber si estamos editando
  rutUsuarioAEditar: string | null = null;  // Almacena el rut del usuario que se está editando

  ngOnInit() {}

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,  
    private navCtrl: NavController,
    private router: Router,
    private storage: Storage  // Inyectar Storage
  ) {
    this.initStorage();  // Inicializar Storage
  
    // Inicialización del formulario
    this.persona = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\\.cl$')]],  
      numero_celular: ['', [Validators.required, Validators.pattern('^\\+569[0-9]{8}$')]], 
      rut: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10), this.validarRut.bind(this)]],  
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
      password: ['', [Validators.required, Validators.minLength(8)]],
      re_password: ['', Validators.required],
      fecha_nacimiento: ['', [Validators.required, this.validarEdadMinima]],
      esprofesor: ['', Validators.required],
    }, { validators: this.passwordsCoinciden });
  
    // Cargar lista de usuarios
    this.cargarUsuarios();
  }
  

  // Inicializar Storage
  async initStorage() {
    await this.storage.create();  // Inicializar el storage
  }

  limpiarFormulario() {
    this.persona.reset();  // Esto reinicia el formulario
    this.editando = false; // Esto asegura que el botón vuelva a decir "Registrar"
  }

  // Cargar usuarios desde el almacenamiento
  async cargarUsuarios() {
    const storedUsers = await this.storage.get('usuarios');
    this.usuarios = storedUsers || [];  // Obtener la lista de usuarios o inicializar vacía
  }

  // Validar que las passwords coincidan
  passwordsCoinciden(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const reppassword = formGroup.get('re_password')?.value;
    return password === reppassword ? null : { noCoinciden: true };
  }

  // Validar que la fecha de nacimiento sea de al menos 18 años
  validarEdadMinima(control: AbstractControl) {
    const fechaNacimiento = moment(control.value);
    const edad = moment().diff(fechaNacimiento, 'years');
    return edad >= 18 ? null : { menorDeEdad: true };
  }

  // Función para mostrar alerta y redirigir
  async mostrarAlerta() {
    const alert = await this.alertController.create({
      header: 'Cuenta creada',
      message: 'Se ha creado tu cuenta correctamente',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.navigateRoot('/administrador'); 
        }
      }]
    });
    await alert.present();
  }

  // Función para registrar o modificar usuario
  async guardarCambios() {
    const usuarioData = { ...this.persona.value };
    usuarioData.fecha_nacimiento = moment(usuarioData.fecha_nacimiento).format('YYYY-MM-DD'); // Formato actualizado
    usuarioData.tipo = this.persona.get('esprofesor')?.value === 'si' ? 'Profesor' : 'Alumno'; // Asignar tipo dinámicamente

    const storedUsers = await this.storage.get('usuarios') || [];
    
    if (this.editando) {
      // Actualizar el usuario si estamos en modo edición
      const index = storedUsers.findIndex((user: any) => user.rut === this.rutUsuarioAEditar);
      if (index !== -1) {
        storedUsers[index] = usuarioData;
        await this.storage.set('usuarios', storedUsers); // Guardar los usuarios actualizados
        console.log("El usuario ha sido actualizado correctamente.");
      } else {
        console.log("Error al actualizar el usuario.");
      }
    } else {
      // Crear un nuevo usuario si no estamos editando
      const usuarioExistente = storedUsers.find((user: any) => user.rut === usuarioData.rut);
      if (!usuarioExistente) {
        storedUsers.push(usuarioData); // Agregar nuevo usuario
        await this.storage.set('usuarios', storedUsers); // Guardar la lista actualizada de usuarios en el almacenamiento
        console.log("El Usuario se ha creado con éxito!");
        await this.mostrarNotificacionUsuarioCreado();  // Mostrar notificación sin redirigir
      } else {
        console.log("Error al crear el usuario. Usuario ya existe.");
      }
    }

    // Resetear el formulario y el estado de edición
    this.resetFormulario();
    this.cargarUsuarios();  // Recargar la lista de usuarios
  }

  public async registroUsuario(): Promise<void> {
    const usuarioData = { ...this.persona.value };
    usuarioData.fecha_nacimiento = moment(usuarioData.fecha_nacimiento).format('YYYY-MM-DD'); // Formato de fecha
    
    // Ajuste dinámico del tipo de usuario según si tiene vehículo
    usuarioData.tipo = this.persona.get('esprofesor')?.value === 'si' ? 'Profesor' : 'Alumno'; 
    
    const storedUsers = await this.storage.get('usuarios') || []; // Obtener usuarios del almacenamiento
    const usuarioExistente = storedUsers.find((user: any) => user.rut === usuarioData.rut);

    if (!usuarioExistente) {
        storedUsers.push(usuarioData); // Agregar nuevo usuario
        await this.storage.set('usuarios', storedUsers); // Guardar la lista actualizada de usuarios en el almacenamiento
        console.log("El Usuario se ha creado con éxito!");
        await this.mostrarNotificacionUsuarioCreado();  // Mostrar notificación sin redirigir
        this.cargarUsuarios(); // Actualiza la lista de usuarios después del registro
    } else {
        console.log("Error! El Usuario ya existe!");
    }
  }

  async mostrarNotificacionUsuarioCreado() {
    const alert = await this.alertController.create({
      header: 'Usuario Creado',
      message: 'La cuenta se ha creado correctamente.',
      buttons: ['OK'] // Mantiene en la misma página después de aceptar
    });
    await alert.present();
  }

  // Prellenar el formulario con los datos del usuario a modificar
  modificarUsuario(usuario: any) {
    this.editando = true;  // Cambia a modo edición
    this.rutUsuarioAEditar = usuario.rut;  // Almacena el rut del usuario que se va a modificar

    // Prellenar el formulario
    this.persona.patchValue(usuario);
  }

  // Función para eliminar usuario
  async eliminarUsuario(rut: string) {
    const storedUsers = await this.storage.get('usuarios') || [];
    const index = storedUsers.findIndex((user: any) => user.rut === rut);
    if (index !== -1) {
      storedUsers.splice(index, 1); // Eliminar el usuario
      await this.storage.set('usuarios', storedUsers); // Guardar la nueva lista
      console.log("El usuario ha sido eliminado correctamente.");
      this.cargarUsuarios(); // Recargar la lista de usuarios
    } else {
      console.log("Error al eliminar el usuario.");
    }
  }

  // Resetear el formulario y las variables de edición
  resetFormulario() {
    this.persona.reset();
    this.editando = false;
    this.rutUsuarioAEditar = null;
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