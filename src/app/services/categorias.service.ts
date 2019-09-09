import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private mapaDeCategorias: any;

  constructor(
    private firestore: AngularFirestore
  ) { }

  private obtenerCategorias(): AngularFirestoreCollection {
    return this.firestore.collection('categorias');
  }

  obtenerMapaDeCategorias() {
    return new Observable((observer) => {

      if (!this.mapaDeCategorias) {
        this.obtenerCategorias().valueChanges().pipe(take(1)).subscribe(
          (data) => {
            this.mapaDeCategorias = {};

            if (data) {
              for (const categoria of data) {
                this.mapaDeCategorias[categoria.id] = categoria.nombre;
              }
            }

            observer.next(this.mapaDeCategorias);
            observer.complete();
          }
        );
      } else {
        observer.next(this.mapaDeCategorias);
        observer.complete();
      }
    });

  }
}
