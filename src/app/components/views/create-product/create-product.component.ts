import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/models/producto';
import { AuthService } from 'src/app/services/core/auth.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { CategoriasService } from 'src/app/services/categorias.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Alert } from 'selenium-webdriver';

declare var $: any;
declare var Dropzone: any;

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit, AfterContentInit {
  aceptarTerminosYCondiciones = false;
  categorias = [];
  errorImagenesRequerido = false;
  loading = false;
  mostrarTerminosYCondiciones = false;
  myDropzone: any;
  producto: Producto;

  constructor(
    private router: Router,
    private afStorage: AngularFireStorage,
    private authService: AuthService,
    private productosService: ProductosService,
    private toastr: ToastrService,
    private categoriasService: CategoriasService
  ) { }

  ngOnInit() {
    Dropzone.autoDiscover = false;

    this.categoriasService.obtenerCategorias().valueChanges().pipe(take(1)).subscribe((respuesta) => {
      this.categorias = respuesta;
    });

    this.producto = new Producto()
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.myDropzone = new Dropzone("div.dropzone", {
        url: "/file/post",
        addRemoveLinks: true,
        acceptedFiles: "image/jpeg,image/png"
      });
    });

  }

  async registrarProducto(form) {

    this.errorImagenesRequerido = false;

    if (!this.myDropzone.files.length) {
      this.errorImagenesRequerido = true;
    }

    if (form.valid && !this.errorImagenesRequerido) {

      if (!this.aceptarTerminosYCondiciones) {
        this.toastr.error('Debe aceptar los términos y condiciones')
        return;
      }

      // Validar fechas      
      let fechaInicio = moment(this.producto.fechaInicio, 'YYYY-MM-DD').startOf('day');
      let fechaFin = moment(this.producto.fechaFin, 'YYYY-MM-DD').startOf('day');

      if (fechaInicio.isSame(fechaFin)) {
        // Fechas nos deben ser iguales
        this.toastr.error('Las fechas elegidas no deben ser iguales');
        return;
      } else if (fechaFin.isBefore(fechaInicio)) {
        this.toastr.error('Las fecha fin no debe ser menor que la fecha de inicio');
        return;
      } else if (fechaInicio.isBefore(moment().startOf('day'))) {
        // Fecha no debe ser menor que hoy
        this.toastr.error('La fecha inicio no debe ser menor a la fecha de hoy');
        return;
      }

      this.loading = true;

      const producto = { ...this.producto };

      producto.fechaInicio = fechaInicio.toDate();
      producto.fechaFin = fechaFin.toDate();
      producto.fechaCreacion = new Date();
      producto.estado = 'C';
      producto.keywords = this.createKeywords(producto.nombre);
      producto.imagenes = [];

      for (const file of this.myDropzone.files) {

        const id = uuid.v4();

        let ref = this.afStorage.ref(`product/${id}`);
        await ref.put(file);
        let url = await ref.getDownloadURL().toPromise();

        // Guardando referencias de imagenes
        producto.imagenes.push(url);

      }

      this.productosService.guardarProducto(this.authService.usuario.uid, producto)
        .then((respuesta) => {
          this.toastr.success('Producto creado correctamente');

          this.router.navigate(['/product-detail', respuesta.id]);
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      this.loading = false;
    }

  }

  private createKeywords(name: string): Array<string> {
    let merged = new Set<string>();

    let words = name.split(' ');
    let words_length = name.split(' ').length;

    for (let i = 0; i < words_length; i++) {
      let buildName = '';

      words.forEach((w, index) => {
        if (index >= i) {
          buildName = buildName.concat(w + ' ');
        }
      });

      merged = new Set([...merged, ...this.generateArrayFromString(buildName)]);

    }

    return [...merged];

  }

  private generateArrayFromString(name: string) {
    const arrName: Array<string> = [];
    let curName = '';
    name.split('').forEach((letter) => {
      curName += letter;
      if (curName.length >= 3) {
        arrName.push(curName.trim());
      }
    });
    return arrName;
  }


}
