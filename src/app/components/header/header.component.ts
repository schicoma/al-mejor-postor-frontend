import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/core/auth.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  estaElUsuarioEnSesion: boolean;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.estaElUsuarioEnSesion = this.authService.estaElUsuarioEnSesion();
  }

  ngAfterViewInit(): void {

    // Toggle search box

    $("#search_input_box").hide();
    $("#search_1").on("click", function () {
      $("#search_input_box").slideToggle();
      $("#search_input").focus();
    });
    $("#close_search").on("click", function () {
      $('#search_input_box').slideUp(500);
    });

    this.estaElUsuarioEnSesion = this.authService.estaElUsuarioEnSesion();

  }

  logout() {
    this.authService.salirSesion();
  }

  mostrarUsuario() {
    this.toastr.success('Bienvenido ' + this.authService.usuario.email);
  }

}
