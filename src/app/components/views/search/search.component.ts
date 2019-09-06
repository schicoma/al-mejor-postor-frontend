import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

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

  ngAfterViewInit(): void {
    // Trigger


    var $range = $(".js-range-slider"),
      $inputFrom = $(".js-input-from"),
      $inputTo = $(".js-input-to"),
      instance,
      min = 0,
      max = 1000,
      from = 10,
      to = 100;

    $range.ionRangeSlider({
      type: "double",
      min: min,
      max: max,
      from: 0,
      to: 500,
      prefix: 'tk. ',
      onStart: updateInputs,
      onChange: updateInputs,
      step: 1,
      prettify_enabled: true,
      prettify_separator: ".",
      values_separator: " - ",
      force_edges: true


    });

    instance = $range.data("ionRangeSlider");

    function updateInputs(data) {
      from = data.from;
      to = data.to;

      $inputFrom.prop("value", from);
      $inputTo.prop("value", to);
    }

    $inputFrom.on("input", function () {
      var val = $(this).prop("value");

      // validate
      if (val < min) {
        val = min;
      } else if (val > to) {
        val = to;
      }

      instance.update({
        from: val
      });
    });

    $inputTo.on("input", function () {
      var val = $(this).prop("value");

      // validate
      if (val < from) {
        val = from;
      } else if (val > max) {
        val = max;
      }

      instance.update({
        to: val
      });
    });
  }
}
