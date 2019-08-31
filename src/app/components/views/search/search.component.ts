import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  items = [
    { nombre: 'ONE PIECE - FIGURA MONKEY D LUFFY', precio: 'S/ 60.00', imagen: 'assets/img/temp/producto_1_a.jpg' },
    { nombre: 'Quartz Belt Watch', precio: '$150.00', imagen: 'assets/img/product/product_1.png' },
    { nombre: 'Quartz Belt Watch', precio: '$150.00', imagen: 'assets/img/product/product_3.png' },
    { nombre: 'Quartz Belt Watch', precio: '$150.00', imagen: 'assets/img/product/product_4.png' },
    { nombre: 'Quartz Belt Watch', precio: '$150.00', imagen: 'assets/img/product/product_5.png' },
    { nombre: 'Quartz Belt Watch', precio: '$150.00', imagen: 'assets/img/product/product_6.png' },
    { nombre: 'Quartz Belt Watch', precio: '$150.00', imagen: 'assets/img/product/product_7.png' },
    { nombre: 'Quartz Belt Watch', precio: '$150.00', imagen: 'assets/img/product/product_8.png' },
    { nombre: 'Quartz Belt Watch', precio: '$150.00', imagen: 'assets/img/product/product_2.png' }
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

}
