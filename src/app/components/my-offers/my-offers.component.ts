import { Component, OnInit } from '@angular/core';
import { OfertasService } from 'src/app/services/ofertas.service';
import { AuthService } from 'src/app/services/core/auth.service';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.scss']
})
export class MyOffersComponent implements OnInit {

  loading = true;
  mapaDeCategorias: any;
  ofertas = [];

  constructor(
    private ofertasService: OfertasService,
    private authService: AuthService,
    private categoriaService: CategoriasService
  ) { }

  ngOnInit() {
    this.obtenerOfertasPorProductos();


    this.categoriaService.obtenerMapaDeCategorias().subscribe(
      (data) => {
        this.mapaDeCategorias = data;
        this.loading = false;
      }, () => {
        this.loading = false;
      }, () => {
        this.loading = false;
      }
    );
  }

  obtenerOfertasPorProductos() {
    if (this.authService.estaElUsuarioEnSesion()) {

      const uidUsuario = this.authService.usuario.uid;

      this.ofertasService.obtenerOfertasPorUsuario(uidUsuario).snapshotChanges().subscribe((respuesta) => {
        this.ofertas = [];

        respuesta.forEach(element => {
          let x = element.payload.doc.data();

          this.ofertas.push(x);
        });
      });
    }

  }

}
