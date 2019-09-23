import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  best_product_slider: any;
  productos: Array<any>;
  producto: any;
  suscription: Subscription;
  timeInterval: any;

  dias: any;
  horas: any;
  minutos: any;
  segundos: any;

  inicializarSliderImagenes() {
    if (this.best_product_slider) {
      $('.best_product_slider').load('', function () {
        $('.best_product_slider').trigger('destroy.owl.carousel');
        this.best_product_slider = $('.best_product_slider').owlCarousel({
          items: 1,
          margin: 10,
          nav: false
        });
        return false;
      });
      return;
    }

    this.best_product_slider = $('.best_product_slider');

    if (this.best_product_slider.length) {
      this.best_product_slider.owlCarousel({
        items: 4,
        loop: true,
        dots: false,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 5000,
        nav: true,
        navText: ["next", "previous"],
        responsive: {
          0: {
            margin: 15,
            items: 1,
            nav: false
          },
          576: {
            margin: 15,
            items: 2,
            nav: false
          },
          768: {
            margin: 30,
            items: 3,
            nav: true
          },
          991: {
            margin: 30,
            items: 4,
            nav: true
          }
        }
      });
    }
  }

  ngAfterViewInit(): void {
    /*if ($('.img-gal').length > 0) {
      $('.img-gal').magnificPopup({
        type: 'image',
        gallery: {
          enabled: true
        }
      });
    }*/


    //single banner slider
    $('.banner_slider').on('initialized.owl.carousel changed.owl.carousel', function (e) {
      function pad2(number) {
        return (number < 10 ? '0' : '') + number
      }
      var carousel = e.relatedTarget;
      $('.slider-counter').text(pad2(carousel.current()));

    }).owlCarousel({
      items: 1,
      loop: true,
      dots: false,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 5000,
      nav: true,
      navText: ["next", "previous"],
      smartSpeed: 1000,
      responsive: {
        0: {
          nav: false
        },
        600: {
          nav: false
        },
        768: {
          nav: true
        }
      }
    });



  }

  constructor(
    private productosService: ProductosService
  ) { }

  ngOnInit() {

    this.suscription = this.productosService.listarUltimos5Productos().snapshotChanges().subscribe((respuesta) => {
      this.productos = [];

      respuesta.forEach(element => {
        let x: any = element.payload.doc.data();
        x.uid = element.payload.doc.id;

        this.productos.push(x);
      });

      if (this.productos.length) {
        this.producto = this.productos[0];

        this.inicializarProductoPrincipal();
      }

      setTimeout(() => {
        this.inicializarSliderImagenes();
      });

    });

  }

  inicializarProductoPrincipal() {
    this.timeInterval = setInterval(() => {
      //		var endTime = new Date("29 April 2018 9:56:00 GMT+01:00");	
      let endTime = this.producto.fechaFin.toDate();
      let endTimeNumber = (endTime.getTime() / 1000);

      let now = new Date();
      let nowTimeNumber = (now.getTime() / 1000);

      var timeLeft = endTimeNumber - nowTimeNumber;

      var days = Math.floor(timeLeft / 86400);
      var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
      var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
      var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

      this.dias = days;
      this.horas = (hours < 10 ? "0" + hours : hours);
      this.minutos = (minutes < 10 ? "0" + minutes : minutes);
      this.segundos = (seconds < 10 ? "0" + seconds : seconds);
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval);

    this.suscription.unsubscribe();
  }

}
