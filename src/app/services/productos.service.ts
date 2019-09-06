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

  guardarProducto(usuario: Usuario, producto: Producto) {
    return this.firebase.collection('productos').add({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      fechaInicio: producto.fechaInicio,
      fechaFin: producto.fechaFin,
      usuario: {
        nombre: usuario.nombres,
        apellido: usuario.apellidos,
        uid: usuario.uid
      }
    });
  }

}
