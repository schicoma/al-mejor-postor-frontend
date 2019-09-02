import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/core/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  bloquearBoton = false;
  confimarPassword: string;
  mostrarPantallaConfirmacion = false;

  usuario: Usuario = new Usuario();

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  registrarUsuario(form) {
    this.bloquearBoton = true;

    if (form.valid) {
      this.usuario.estado = 'PE';

      this.usuariosService.insertarUsuario(this.usuario).then((respuesta) => {
        this.authService.crearUsuario(this.usuario.email, this.usuario.password);

        this.mostrarPantallaConfirmacion = true;
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        this.bloquearBoton = false;
      });
    }
  }

}
