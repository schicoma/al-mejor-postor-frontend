import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import * as uuid from 'uuid';
declare var $: any;
declare var Dropzone: any;

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit, AfterContentInit {

  categorias = [];
  myDropzone: any;

  constructor(
    private afStorage: AngularFireStorage
  ) { }

  ngOnInit() {
    Dropzone.autoDiscover = false;

    this.categorias = [
      { id: 1, nombre: 'Juguetes' },
      { id: 2, nombre: 'Figuras de acción' },
      { id: 3, nombre: 'Videojuegos' }
    ];

    $('select').niceSelect('update');
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    setTimeout(() => {
      $('select').niceSelect();

      this.myDropzone = new Dropzone("div.dropzone", { url: "/file/post", addRemoveLinks: true });
    });

  }

  async registrarProducto(form) {
    console.log(this.myDropzone.files);

    for (const file of this.myDropzone.files) {

      const id = uuid.v4();

      let ref = this.afStorage.ref(id);
      await ref.put(file);
      let url = await ref.getDownloadURL().toPromise();

      console.log(url);
    }
  }

}
