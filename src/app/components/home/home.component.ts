import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  dias: any;
  horas: any;
  minutos: any;
  segundos: any;

  ngAfterViewInit(): void {
    var best_product_slider = $('.best_product_slider');
    if (best_product_slider.length) {
      best_product_slider.owlCarousel({
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

    //product list slider
    var product_list_slider = $('.product_list_slider');
    if (product_list_slider.length) {
      product_list_slider.owlCarousel({
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
            margin: 15,
            nav: false,
            items: 1
          },
          600: {
            margin: 15,
            items: 1,
            nav: false
          },
          768: {
            margin: 30,
            nav: true,
            items: 1
          }
        }
      });
    }

    //single banner slider
    // var banner_slider = $('.banner_slider');
    // if (banner_slider.length) {
    //   banner_slider.owlCarousel({
    //     items: 1,
    //     loop: true,
    //     dots: false,
    //     autoplay: true,
    //     autoplayHoverPause: true,
    //     autoplayTimeout: 5000,
    //     nav: true,
    //     navText: ["next","previous"],
    //     smartSpeed: 1000,
    //   });
    // }

    if ($('.img-gal').length > 0) {
      $('.img-gal').magnificPopup({
        type: 'image',
        gallery: {
          enabled: true
        }
      });
    }


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

    function makeTimer() {

      //		var endTime = new Date("29 April 2018 9:56:00 GMT+01:00");	
      let endTime = new Date("04 Sep 2019 12:56:00 GMT+05:00");
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

    }

    setInterval(function () {
      makeTimer();
    }, 1000);

  }

  constructor() { }

  ngOnInit() {
  }

}
