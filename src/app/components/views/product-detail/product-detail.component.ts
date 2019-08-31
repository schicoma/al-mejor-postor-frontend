import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;

import '../../../../assets/js/lightslider.min.js';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    var product_overview = $('#vertical');

    console.log(product_overview);

    if (product_overview.length) {
      product_overview.lightSlider({
        gallery: true,
        item: 1,
        vertical: true,
        verticalHeight: 450,
        thumbItem: 3,
        slideMargin: 0,
        speed: 600,
        autoplay: true,
        responsive: [
          {
            breakpoint: 991,
            settings: {
              item: 1,

            }
          },
          {
            breakpoint: 576,
            settings: {
              item: 1,
              slideMove: 1,
              verticalHeight: 350,
            }
          }
        ]
      });
    }
  }

}
