import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import * as uuid from 'uuid';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/models/producto';
import { AuthService } from 'src/app/services/core/auth.service';
import { Router } from '@angular/router';
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
    private productosService: ProductosService
  ) { }

  ngOnInit() {
    Dropzone.autoDiscover = false;

    this.categorias = [
      { id: 1, nombre: 'Juguetes' },
      { id: 2, nombre: 'Figuras de acción' },
      { id: 3, nombre: 'Videojuegos' }
    ];

    this.producto = new Producto()
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    setTimeout(() => {
      $('.nice_select').niceSelect();

      this.myDropzone = new Dropzone("div.dropzone", { url: "/file/post", addRemoveLinks: true });
    });

  }

  onChange(event) {
    console.log(event);
  }

  async registrarProducto(form) {
    this.errorImagenesRequerido = false;

    if (!this.myDropzone.files.length) {
      this.errorImagenesRequerido = true;
    }

    if (form.valid && !this.errorImagenesRequerido) {

      if (!this.aceptarTerminosYCondiciones) {
        alert('Debe aceptar los términos y condiciones')
        return;
      }

      this.loading = true;

      this.producto.imagenes = [];

      for (const file of this.myDropzone.files) {

        const id = uuid.v4();

        let ref = this.afStorage.ref(`product/${id}`);
        await ref.put(file);
        let url = await ref.getDownloadURL().toPromise();

        // Guardando referencias de imagenes
        this.producto.imagenes.push(url);

      }

      this.productosService.guardarProducto(this.authService.usuario.uid, this.producto)
        .then((respuesta) => {
          console.log(respuesta);
          this.router.navigate(['/product-detail', respuesta.id]);
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      this.loading = false;
    }

  }

}
