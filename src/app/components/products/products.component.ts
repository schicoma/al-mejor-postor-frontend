import { Component, OnInit } from '@angular/core';

//Service
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
  }

}
