import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Oferta } from '../models/oferta';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor(
    private firebase: AngularFirestore
  ) { }

  guardarOferta(oferta: Oferta) {
    return this.firebase.collection('ofertas').add({
      id: oferta.id,
      fecha: oferta.fecha,
      precioAntiguo: oferta.precioAntiguo,
      precioNuevo: oferta.precioNuevo,
      usuario: oferta.usuario,
      producto: oferta.producto
    });
  }

  obtenerOfertasPorProducto(uidProducto: string) {
    return this.firebase.collection('ofertas', ref => ref.where('producto.uid', '==', uidProducto).orderBy('fecha', 'desc'));
  }

  obtenerOfertasPorUsuario(uidUsuario: string) {
    return this.firebase.collection('ofertas', ref => ref.where('usuario.uid', '==', uidUsuario).orderBy('fecha', 'desc'));
  }
}
