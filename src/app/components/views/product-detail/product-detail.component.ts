import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service.js';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.js';
import { CategoriasService } from 'src/app/services/categorias.service.js';
import { AuthService } from 'src/app/services/core/auth.service.js';
import * as uuid from 'uuid';
import { Oferta } from 'src/app/models/oferta';
import * as firebase from 'firebase/app';
import '../../../../assets/js/lightslider.min.js'
import { OfertasService } from 'src/app/services/ofertas.service.js';

declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  cantidadAOfertar: number;
  loading = true;
  mapaDeCategorias: any;
  mostrarFormularioAOfertar: boolean;
  product_overview: any;
  uidProducto: string;
  uidUsuario: string;

  /*
  * Esta variable sirve para saber si el producto que se muestra es un producto que ha sido registrado
  * con el usuario actual (en sesión)
  */
  esMiProductoOfertado = false;

  producto: Producto = new Producto();

  constructor(
    private activatedRouter: ActivatedRoute,
    private productosService: ProductosService,
    private ofertasService: OfertasService,
    private categoriasService: CategoriasService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    const usuarioEnSesion = this.authService.estaElUsuarioEnSesion();
    if (usuarioEnSesion) {
      this.uidUsuario = this.authService.usuario.uid;
    } else {

    }

    let id = this.activatedRouter.snapshot.params.id;

    if (!(id && id.length)) {
      id = 'not-found';
    }

    this.productosService.obtenerProductoSnapshotChanges(id).subscribe((next) => {
      if (next.payload.exists) {
        this.uidProducto = next.payload.id;
        const productoFromDB: any = next.payload.data();

        this.producto = productoFromDB;

        if (!this.producto.precioNuevo) {
          this.producto.precioNuevo = this.producto.precio;
        }

        if (this.uidUsuario === productoFromDB.usuario.uid) {
          this.esMiProductoOfertado = true;
        }

        setTimeout(() => {
          this.inicializarSlider();
        });
      }

      this.loading = false;
    }, (error) => {
      console.log(error);
    }, () => {
      console.log('finally');
    });

    this.categoriasService.obtenerMapaDeCategorias().subscribe(
      (data) => {
        this.mapaDeCategorias = data;
      }
    );
  }

  aumentarCantidadAOfertar() {
    this.cantidadAOfertar = this.cantidadAOfertar + 1;
  }

  mostrarFormularioOfertarFn() {
    this.cantidadAOfertar = this.producto.precioNuevo;
    this.mostrarFormularioAOfertar = true;
  }

  async registrarOferta() {

    this.loading = true;

    const uidOferta = uuid.v4();

    //Registrando ofertas 

    const oferta = new Oferta();
    oferta.id = uidOferta;
    oferta.fecha = firebase.firestore.FieldValue.serverTimestamp();
    oferta.precioAntiguo = this.producto.precioNuevo;
    oferta.precioNuevo = this.cantidadAOfertar;

    oferta.usuario = {
      uid: this.uidUsuario,
      nombre: ''
    };

    oferta.producto = {
      uid: this.uidProducto
    };

    // //Actualizando producto

    this.producto.precioAntiguo = this.producto.precio;
    this.producto.precioNuevo = this.cantidadAOfertar;

    if (!this.producto.ofertas) {
      this.producto.ofertas = [];
    }

    this.producto.ofertas.push({
      uid: uidOferta
    });

    await this.ofertasService.guardarOferta(oferta);
    this.productosService.actualizarProducto(this.uidProducto, this.producto).then(() => {
      this.mostrarFormularioAOfertar = false;
      this.loading = false;
    });
  }

  restarCantidadAOfertar() {

    if (this.producto.precioAntiguo < this.cantidadAOfertar) {
      this.cantidadAOfertar = this.cantidadAOfertar - 1;
    }
  }

  inicializarSlider() {
    if (this.product_overview) {
      this.product_overview.destroy();
    }

    let product_overview = $('#vertical');

    if (product_overview.length) {
      this.product_overview = product_overview.lightSlider({
        gallery: true,
        item: 1,
        vertical: true,
        verticalHeight: 350,
        //vThumbWidth: 50,
        vThumbWidth: 100,
        thumbItem: 4,
        slideMargin: 0,
        speed: 600,
        autoplay: true,
        responsive: [
          {
            breakpoint: 991,
            settings: {
              item: 1,
            }
          },
          {
            breakpoint: 576,
            settings: {
              item: 1,
              slideMove: 1,
              verticalHeight: 350,
            }
          }
        ]
      });
    }
  }
}
