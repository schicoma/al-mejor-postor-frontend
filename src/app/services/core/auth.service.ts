import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuario: User;

  constructor(public afAuth: AngularFireAuth, public router: Router) {
    this.afAuth.authState.subscribe(user => {
      if (user && user.emailVerified) {
        this.usuario = user;
        localStorage.setItem('user', JSON.stringify(this.usuario));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  crearUsuario(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  obtenerUsuarioEnSesion() {
    console.log(localStorage.getItem('user'));
  }

  iniciarSesion(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  salirSesion() {
    this.afAuth.auth.signOut().then(value => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  estaElUsuarioEnSesion() {
    const usuario = JSON.parse(localStorage.getItem('user'));

    const estaElUsuarioEnSesion = usuario !== undefined && usuario !== null;

    if (estaElUsuarioEnSesion && !this.usuario) {
      this.usuario = usuario;
    }

    return estaElUsuarioEnSesion;
  }

}
