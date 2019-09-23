import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Producto } from '../models/producto';
import { query } from '@angular/animations';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private COLLECTION_NAME: string = 'productos';
  public limitProducts = 8;

  constructor(
    private firebase: AngularFirestore
  ) { }

  generateUId() {
    return this.firebase.collection(this.COLLECTION_NAME).ref.doc().id;
  }

  actualizarProducto(uidProducto: string, datosActualizados: any) {
    return this.firebase.collection(this.COLLECTION_NAME).doc(uidProducto).set(datosActualizados);
  }

  guardarProductoWithCustomUid(uidProducto: string, uidUsuario: string, producto: Producto) {

    return this.firebase.collection(this.COLLECTION_NAME).doc(uidProducto).set({
      categoria: producto.categoria,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      fechaInicio: producto.fechaInicio,
      fechaFin: producto.fechaFin,
      imagenes: producto.imagenes,
      usuario: {
        uid: uidUsuario
      },
      keywords: producto.keywords,
      fechaCreacion: producto.fechaCreacion,
      uid: uidProducto
    });
  }

  guardarProducto(uidUsuario: string, producto: Producto) {
    return this.firebase.collection(this.COLLECTION_NAME).add({
      categoria: producto.categoria,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      fechaInicio: producto.fechaInicio,
      fechaFin: producto.fechaFin,
      imagenes: producto.imagenes,
      usuario: {
        uid: uidUsuario
      },
      keywords: producto.keywords,
      fechaCreacion: producto.fechaCreacion
    });
  }

  obtenerProducto(id: string) {
    return this.firebase.collection(this.COLLECTION_NAME).doc(id).get();
  }

  obtenerProductoSnapshotChanges(id: string) {
    return this.firebase.collection(this.COLLECTION_NAME).doc(id).snapshotChanges();
  }

  listarUltimos5Productos() {
    return this.firebase.collection(this.COLLECTION_NAME, ref => ref.orderBy('fechaInicio', 'desc').limit(5));
  }

  listarProductosByUids(listaProductosUids) {
    let productosRef = this.firebase.collection(this.COLLECTION_NAME);

    var favoritosPromise = [];

    for (let uid of listaProductosUids) {
      favoritosPromise.push(productosRef.doc(uid).get());
    }

    return of(favoritosPromise);
  }

  listarProductosNext(comenzarDespuesDe?: any, options: any = {}) {

    console.log('filtrando por', options);

    return this.firebase.collection(this.COLLECTION_NAME, ref => {

      let query: Query = ref.orderBy(options.orderBy || 'fechaFin', 'asc');

      if (options.filterCategory) {
        query = query.where('categoria', '==', options.filterCategory);
      }

      if (options.filterName) {
        query = query.where('keywords', 'array-contains', options.filterName.toUpperCase());
      }

      if (comenzarDespuesDe) {
        query = query.startAfter(comenzarDespuesDe);
      }

      query = query.limit(this.limitProducts);

      return query;
    });
  }

  listarProductosPrev(comenzarEn?: any, options: any = {}) {

    return this.firebase.collection(this.COLLECTION_NAME, ref => {

      let query: Query = ref.orderBy(options.orderBy || 'fechaFin', 'asc');

      if (options.filterCategory) {
        query = query.where('categoria', '==', options.filterCategory);
      }

      if (options.filterName) {
        query = query.where('keywords', 'array-contains', options.filterName.toUpperCase());
      }

      if (comenzarEn) {
        query = query.startAt(comenzarEn);
      }

      query = query.limit(this.limitProducts);

      return query;
    });
  }
}
