import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/core/auth.service';
import * as uuid from 'uuid';

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

  async registrarUsuario(form) {
    this.bloquearBoton = true;

    if (form.valid) {

      var respuesta = await this.authService.crearUsuario(this.usuario.email, this.usuario.password);

      this.usuario.estado = 'PE';
      this.usuario.uid = respuesta.user.uid;
      this.usuario.token = uuid.v4(); 

      console.log(this.usuario);

      this.usuariosService.insertarUsuario(this.usuario).then((respuesta) => {

        this.mostrarPantallaConfirmacion = true; 
        
      }).catch((error) => {
        console.log(error);
        this.bloquearBoton = false;
      }).finally(() => {
        this.bloquearBoton = false;
      });
    }
  }

}
