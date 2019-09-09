import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private firebase: AngularFirestore
  ) { }

  insertarUsuario(usuario: Usuario) {
    return this.firebase.collection('usuarios').doc(usuario.email).set({
      uid: usuario.uid,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      password: usuario.password,
      telefono: usuario.telefono,
      estado: usuario.estado,
      token: usuario.token
    });
  }

  obtenerUsuario(email: string) {
    return this.firebase.collection('usuarios').doc(email);
  }

  actualizarUsuario(uidUsuario: string, data: any) {
    return this.firebase.collection('usuarios').doc(uidUsuario).update(data);
  }
}
