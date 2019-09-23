import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { take, first } from 'rxjs/operators';
import { CategoriasService } from 'src/app/services/categorias.service';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/core/auth.service';

declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

  categorias: any;
  items: Array<any>;

  favoritos: any;
  firstInResponse: any;
  lastInResponse: any;
  nombreAFiltrar: string;
  options: any = {};
  orderBy: string = 'fechaFin';

  // Array de los primeros docuentos de las páginas previas
  prev_strt_at: Array<any> = [];

  pagination_clicked_count = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productosServices: ProductosService,
    private categoriasServices: CategoriasService,
    private usuarioService: UsuariosService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    if (this.authService.estaElUsuarioEnSesion()) {
      let usuarioEmail = this.authService.usuario.email;

      this.usuarioService.obtenerUsuarioByEmail(usuarioEmail).valueChanges().pipe(take(1))
        .subscribe((data: any) => {
          if (data) {
            this.favoritos = data.favoritos;
          }

          if (!this.favoritos) {
            this.favoritos = {};
          }

          this.categoriasServices.obtenerMapaDeCategorias().pipe(first()).subscribe(categorias => {

            if (data && data.preferencias && Object.keys(data.preferencias).length) {
              for (let preferencia of Object.keys(categorias)) {
                if (!data.preferencias[preferencia]) {
                  delete categorias[preferencia];
                }
              }
            }

            this.categorias = categorias;

          });
        });
    }

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.filterCategory) {
        this.options.filterCategory = params.filterCategory;
      }

      if (params.filterName) {
        this.options.filterName = params.filterName;
      }

      if (params.orderBy) {
        this.options.orderBy = params.orderBy;
        this.orderBy = params.orderBy;
      }

      this.next();
    });

  }

  ordenar(orderBy: string) {
    this.clearCursors();

    this.options.orderBy = orderBy;

    this.router.navigate(['/search'], { queryParams: this.options });
  }

  filtrarPorCategoria(categoria?: any) {
    this.clearCursors();

    if (this.orderBy) {
      this.options.orderBy = this.orderBy;
    }

    if (categoria) {
      this.options.filterCategory = categoria;
    } else {
      delete this.options.filterCategory;
    }

    this.router.navigate(['/search'], { queryParams: this.options });
  }

  filtrarPorNombre(nombre?: any) {
    console.log(nombre);
    this.clearCursors();

    if (this.orderBy) {
      this.options.orderBy = this.orderBy;
    }

    if (nombre) {
      this.options.filterName = nombre;
    } else {
      delete this.options.filterName;
    }

    this.router.navigate(['/search'], { queryParams: this.options });
  }

  marcarFavorito(item) {

    let usuarioUid = this.authService.usuario.uid;

    this.usuarioService.obtenerUsuarioByDocId(usuarioUid).valueChanges().pipe(take(1))
      .subscribe((data: any) => {

        if (data) {
          let favoritos = data[0].favoritos;

          if (!favoritos) {
            favoritos = {};
          }

          if (!favoritos[item.uid]) {
            favoritos[item.uid] = true;
          } else {
            favoritos[item.uid] = !favoritos[item.uid];
          }

          item.favorito = favoritos[item.uid];

          this.favoritos = favoritos;

          this.usuarioService.actualizarFavoritosFromUsuarioByDocId(data[0].email, favoritos).then((data) => {

          });

        }
      });
  }

  next() {
    this.productosServices.listarProductosNext(this.lastInResponse, this.options).snapshotChanges().pipe(take(1)).subscribe((respuesta) => {

      if (!respuesta.length) {
        return;
      }

      this.items = [];

      respuesta.forEach((element: any) => {
        let x = element.payload.doc.data();
        x['uid'] = element.payload.doc.id;

        if (this.authService.estaElUsuarioEnSesion()) {
          x.favorito = !!(this.favoritos[x.uid]);
        }

        this.items.push(x);
      });

      if (!this.lastInResponse) {
        this.pagination_clicked_count = 0;
      } else {
        this.pagination_clicked_count++;
      }

      this.firstInResponse = respuesta[0].payload.doc;
      this.lastInResponse = respuesta[respuesta.length - 1].payload.doc;

      this.prev_strt_at.push(this.firstInResponse);

    });
  }

  prev() {
    this.productosServices.listarProductosPrev(this.get_prev_startAt(), this.options).snapshotChanges().pipe(take(1)).subscribe((respuesta) => {
      this.items = [];

      respuesta.forEach((element: any) => {
        let x = element.payload.doc.data();
        x['uid'] = element.payload.doc.id;

        if (this.authService.estaElUsuarioEnSesion()) {
          x.favorito = !!(this.favoritos[x.uid]);
        }

        this.items.push(x);
      });

      this.firstInResponse = respuesta[0].payload.doc;
      this.lastInResponse = respuesta[respuesta.length - 1].payload.doc;

      this.pagination_clicked_count--;

      this.prev_strt_at.forEach(element => {
        if (this.firstInResponse.id == element.id) {
          element = undefined;
        }
      });
    });
  }

  // Retorna el documento donde la pagina previa comenzó (startAt)
  get_prev_startAt() {
    if (this.prev_strt_at.length > (this.pagination_clicked_count + 1)) {
      this.prev_strt_at.splice(this.prev_strt_at.length - 2, this.prev_strt_at.length - 1);
    }

    return this.prev_strt_at[this.pagination_clicked_count - 1];
  }

  clearCursors() {
    this.prev_strt_at.splice(0, this.prev_strt_at.length - 1);
    this.lastInResponse = undefined;
    this.firstInResponse = undefined;

    this.pagination_clicked_count = 0;
  }

  ngAfterViewInit(): void {
    // Trigger
    var $range = $(".js-range-slider"),
      $inputFrom = $(".js-input-from"),
      $inputTo = $(".js-input-to"),
      instance,
      min = 0,
      max = 1000,
      from = 10,
      to = 100;

    $range.ionRangeSlider({
      type: "double",
      min: min,
      max: max,
      from: 0,
      to: 500,
      prefix: 'tk. ',
      onStart: updateInputs,
      onChange: updateInputs,
      step: 1,
      prettify_enabled: true,
      prettify_separator: ".",
      values_separator: " - ",
      force_edges: true
    });

    instance = $range.data("ionRangeSlider");

    function updateInputs(data) {
      from = data.from;
      to = data.to;

      $inputFrom.prop("value", from);
      $inputTo.prop("value", to);
    }

    $inputFrom.on("input", function () {
      var val = $(this).prop("value");

      // validate
      if (val < min) {
        val = min;
      } else if (val > to) {
        val = to;
      }

      instance.update({
        from: val
      });
    });

    $inputTo.on("input", function () {
      var val = $(this).prop("value");

      // validate
      if (val < from) {
        val = from;
      } else if (val > max) {
        val = max;
      }

      instance.update({
        to: val
      });
    });
  }

}
