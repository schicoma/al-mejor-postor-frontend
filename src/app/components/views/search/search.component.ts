import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { take } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

  items: Array<any>;
  startAfter: any;

  constructor(
    private router: Router,
    private productosServices: ProductosService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    this.next()

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

  next() {

    this.productosServices.listarProductos(this.startAfter).snapshotChanges().pipe(take(1)).subscribe((respuesta) => {
      this.items = [];

      respuesta.forEach((element: any) => {
        console.log(element);
        let x = element.payload.doc.data();
        x['uid'] = element.payload.doc.id;

        console.log(x);

        this.items.push(x);
      });

      this.startAfter = respuesta[respuesta.length - 1].payload.doc;

    });
  }

}
