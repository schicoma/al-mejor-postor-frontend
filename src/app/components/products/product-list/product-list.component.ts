import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  productList: Product[];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.productService.getProducts()
      .snapshotChanges()
      .subscribe(item => {

        console.log(item);

        this.productList = [];

        item.forEach(element => {
          let x = element.payload.doc.data();
          x['$key'] = element.payload.doc.id;

          this.productList.push(x as Product);
        });
      });
  }

  onEdit(product: Product) {
    this.productService.selectedProduct = {...product};
  }

  onDelete($key: string) {
    this.productService.deleteProduct($key);
  }

}
