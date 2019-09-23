import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/core/auth.service';
import { take } from 'rxjs/operators';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  loading = true;
  mostrarFormulario = false;
  preferencias: Array<any>;
  usuario: any = {};

  constructor(
    private usuarioService: UsuariosService,
    private authService: AuthService,
    private categoriaService: CategoriasService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    if (this.authService.estaElUsuarioEnSesion()) {
      this.usuarioService.obtenerUsuarioByEmail(this.authService.usuario.email)
        .valueChanges().pipe(take(1)).subscribe((respuesta) => {
          this.usuario = respuesta;

          return this.categoriaService.obtenerCategorias().valueChanges().pipe(take(1)).subscribe((respuesta) => {
            let categorias = respuesta;

            if (!this.usuario.preferencias) {
              this.usuario.preferencias = {};
            }

            for (const preferencia of categorias) {
              if (this.usuario.preferencias[preferencia.id]) {
                preferencia.checked = true;
              }
            }

            this.preferencias = categorias;

            this.loading = false;
          });

        });
    }

  }

  guardarPreferencias() {
    const preferencias = {};

    let lanzarMensajeDeError = true;

    for (const preferencia of this.preferencias) {
      if (preferencia.checked) {
        preferencias[preferencia.id] = {
          nombre: preferencia.nombre
        }

        lanzarMensajeDeError = false;
      }
    }

    if (lanzarMensajeDeError) {
      this.toastr.error('Debe escoger al menos una categoría para guardar sus preferencias');
      return;
    }

    this.loading = true;

    this.usuarioService.actualizarUsuario(this.usuario.email, {
      preferencias: preferencias
    }).then(() => {
      this.toastr.success('Sus preferencias han sido actualizadas correctamente');
    }).finally(() => {
      this.loading = false;
    });
  }

  actualizarDatos() {
    this.mostrarFormulario = true;
  }

  actualizarDatosSubmit(myForm) {

    if (myForm.valid) {
      this.usuarioService.actualizarUsuario(this.usuario.email, {
        nombres: this.usuario.nombres,
        apellidos: this.usuario.apellidos,
        telefono: this.usuario.telefono
      }).then(() => {
        this.mostrarFormulario = false;
        this.toastr.success("Datos correctamente actualizados");
      });
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
  }

}
