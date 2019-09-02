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
      console.log("suscribe");
      if (user && user.emailVerified) {
        this.usuario = user;
        localStorage.setItem('user', JSON.stringify(this.usuario));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  crearUsuario(email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(value => {
      console.log('Success! createUserWithEmailAndPassword', value);
    }).catch(error => {
      console.log('Something went wrong:', error.message);
    });
  }

  iniciarSesion(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)/*.then(value => {
      console.log('Nice, it worked!');
    }).catch(error => {
      console.log('Something went wrong:', error.message);
    });*/;
  }

  salirSesion() {
    this.afAuth.auth.signOut().then(value => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  estaElUsuarioEnSesion() {
    const usuario = JSON.parse(localStorage.getItem('user'));
    return usuario != null
  }

}
