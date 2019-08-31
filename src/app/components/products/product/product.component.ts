import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { NgForm } from '@angular/forms';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.productService.getProducts();
    this.resetForm();
  }

  onSubmit(productForm: NgForm) {
    let product = productForm.value;

    if (!this.productService.selectedProduct.$key) {
      this.productService.insertProduct(product);
    } else {
      product.$key = this.productService.selectedProduct.$key;

      this.productService.updateProduct(product);
    }

    this.resetForm(productForm);
  }

  resetForm(productForm?: NgForm) {
    if (productForm) {
      productForm.reset();
      this.productService.selectedProduct = new Product();
    }
  }

}
