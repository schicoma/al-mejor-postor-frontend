import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/core/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credenciales: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  iniciarSesion() {
    this.authService.iniciarSesion(this.credenciales.email, this.credenciales.password).then(value => {
      if (value.user.emailVerified) {
        this.router.navigate(['/search']);
      } else {
        throw ({ code: 'web/email-not-verified' });
      }
    }).catch(error => {
      switch (error.code) {
        case 'auth/user-not-found': case 'auth/invalid-email': case 'auth/wrong-password':
          alert('Credenciales incorrectas');
          break;
        case 'web/email-not-verified':
          alert('Correo electrónico no verificado');
          break;
        default:
          alert('Ha ocurrido un error, inténtelo más tarde');
      }
    });
  }

}
