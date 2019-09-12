import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/core/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credenciales: any = {};
  returnUrl: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.returnUrl = this.activatedRouter.snapshot.queryParams['returnUrl'] || '/search';
  }

  iniciarSesion() {
    this.authService.iniciarSesion(this.credenciales.email, this.credenciales.password).then(value => {
      if (value.user.emailVerified) {
        this.router.navigate([this.returnUrl]);
      } else {
        throw ({ code: 'web/email-not-verified' });
      }
    }).catch(error => {
      switch (error.code) {
        case 'auth/user-not-found': case 'auth/invalid-email': case 'auth/wrong-password':
          this.toastr.error('Credenciales incorrectas');
          break;
        case 'web/email-not-verified':
          this.toastr.error('Correo electrónico no verificado');
          break;
        default:
          this.toastr.error('Ha ocurrido un error, inténtelo más tarde');
      }
    });
  }

}
