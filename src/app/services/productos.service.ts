import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Producto } from '../models/producto';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private firebase: AngularFirestore
  ) { }

  actualizarProducto(uidProducto: string, datosActualizados: any) {
    return this.firebase.collection('productos').doc(uidProducto).set(datosActualizados);
  }

  guardarProducto(uidUsuario: string, producto: Producto) {
    return this.firebase.collection('productos').add({
      categoria: producto.categoria,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      fechaInicio: producto.fechaInicio,
      fechaFin: producto.fechaFin,
      imagenes: producto.imagenes,
      usuario: {
        uid: uidUsuario
      }
    });
  }

  obtenerProducto(id: string) {
    return this.firebase.collection('productos').doc(id).get();
  }

  obtenerProductoSnapshotChanges(id: string) {
    return this.firebase.collection('productos').doc(id).snapshotChanges();
  }

}
