import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productList: AngularFirestoreCollection<any>;

  selectedProduct: Product = new Product();

  constructor(
    private firebase: AngularFirestore
  ) { }

  getProducts() {
    return this.productList = this.firebase.collection('products');
  }

  insertProduct(product: Product) {
    this.productList.add({
      name: product.name,
      category: product.category,
      location: product.location,
      price: product.price
    })
  }

  updateProduct(product: Product) {
    this.productList.doc(product.$key).set({
      name: product.name,
      category: product.category,
      location: product.location,
      price: product.price
    });
  }

  deleteProduct($key: string) {
    this.productList.doc($key).delete();
  }

}
