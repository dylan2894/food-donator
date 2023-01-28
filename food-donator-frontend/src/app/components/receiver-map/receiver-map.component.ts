import { Component, OnInit } from '@angular/core';
import M from 'materialize-css';

declare const $: any

@Component({
  selector: 'app-receiver-map',
  templateUrl: './receiver-map.component.html',
  styleUrls: ['./receiver-map.component.css']
})
export class ReceiverMapComponent implements OnInit {

  mapOptions: google.maps.MapOptions = {
    center: { lat: -25.781951024040037, lng: 28.338064949199595 },
    zoom: 16,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: false
  };

  ngOnInit() {
    $(document).ready(() => {
      const sidenav = M.Sidenav.getInstance(document.querySelector('.sidenav') as Element);
      $('.sidenav').sidenav();
      $('select').formSelect();
      $('select').on('change', function(this: any) {
        console.log(this.value);
      });

      $('#hiddenMenu').mouseenter(() => {
        this.openMenu();
      });

      $('#hiddenMenu').click(() => {
        this.openMenu();
      });

      $('.sidenav').mouseleave(() => {
        this.closeMenu();
      });

      $('*').on('click', () => {
        const sidenav = M.Sidenav.getInstance(document.querySelector('.sidenav') as Element);
        if(!sidenav.isOpen){
          $('#hiddenMenu').css('display', 'block');
        }
        //this.closeMenu();
      });

      $( "#slide-out" ).on("close", () => {
        alert('sd');
        this.closeMenu();
      });
    });
  }

  openMenu() {
    const sidenav = M.Sidenav.getInstance(document.querySelector('.sidenav') as Element);
    sidenav.open();
    $('#hiddenMenu').css('display', 'none');
  }

  closeMenu() {
    const sidenav = M.Sidenav.getInstance(document.querySelector('.sidenav') as Element);
    sidenav.close();
    $('#hiddenMenu').css('display', 'block');
  }

}
