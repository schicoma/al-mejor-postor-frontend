import '../../../../assets/js/lightslider.min.js'
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service.js';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/models/producto.js';
import { CategoriasService } from 'src/app/services/categorias.service.js';
import { AuthService } from 'src/app/services/core/auth.service.js';
import { Oferta } from 'src/app/models/oferta';
import { OfertasService } from 'src/app/services/ofertas.service.js';
import { UsuariosService } from 'src/app/services/usuarios.service.js';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as uuid from 'uuid';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  cantidadAOfertar: number;
  loading = true;
  mapaDeCategorias: any;
  mostrarFormularioAOfertar: boolean;
  ofertas: Array<any>;
  ofertasSubscription: Subscription;
  product_overview: any;
  productoSubscription: Subscription;
  uidProducto: string;
  uidUsuario: string;
  usuarioDB: any;

  /*
  * Esta variable sirve para saber si el producto que se muestra es un producto que ha sido registrado
  * con el usuario actual (en sesión)
  */
  esMiProductoOfertado = false;

  producto: Producto = new Producto();

  constructor(
    private router: Router, 
    private activatedRouter: ActivatedRoute,
    private productosService: ProductosService,
    private ofertasService: OfertasService,
    private categoriasService: CategoriasService,
    private authService: AuthService,
    private usuarioService: UsuariosService,
    private toastr: ToastrService
  ) { }

  ngOnDestroy(): void {
    this.ofertasSubscription.unsubscribe();
    this.productoSubscription.unsubscribe();
  }

  ngOnInit() {
    window.scroll(0, 0);

    const usuarioEnSesion = this.authService.estaElUsuarioEnSesion();
    if (usuarioEnSesion) {
      this.uidUsuario = this.authService.usuario.uid;

      this.usuarioService.obtenerUsuario(this.authService.usuario.email).valueChanges().pipe(take(1))
        .subscribe((usuario) => {
          this.usuarioDB = usuario;
        });

    } else {

    }

    let id = this.activatedRouter.snapshot.params.id;

    if (!(id && id.length)) {
      id = 'not-found';
    }

    this.productoSubscription = this.productosService.obtenerProductoSnapshotChanges(id).subscribe((next) => {
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

        if (!this.ofertas) {
          this.ofertasSubscription = this.ofertasService.obtenerOfertasPorProducto(id).snapshotChanges().subscribe((ofertas) => {
            this.ofertas = [];

            ofertas.forEach(element => {
              let x = element.payload.doc.data();
              //x['$key'] = element.payload.doc.id;

              this.ofertas.push(x);
            });
          });
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
    if (this.uidUsuario) {
      this.cantidadAOfertar = this.producto.precioNuevo;
      this.mostrarFormularioAOfertar = true;
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }

  }

  async registrarOferta() {

    if (this.cantidadAOfertar <= this.producto.precioNuevo) {
      this.toastr.warning('Verifique que el precio a ofertar sea mayor al nuevo precio', 'El precio ha cambiado');
      return;
    }

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
      nombre: `${this.usuarioDB.nombres} ${this.usuarioDB.apellidos}`
    };

    oferta.producto = {
      uid: this.uidProducto,
      nombre: this.producto.nombre,
      categoria: this.producto.categoria,
    };

    // //Actualizando producto

    this.producto.precioAntiguo = this.producto.precioNuevo;
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
      this.toastr.success('La oferta fue registrada correctamente');
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
