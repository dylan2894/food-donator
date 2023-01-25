import { Component, OnInit } from '@angular/core';

declare const $: any

@Component({
  selector: 'app-receiver-map',
  templateUrl: './receiver-map.component.html',
  styleUrls: ['./receiver-map.component.css']
})
export class ReceiverMapComponent implements OnInit {

  isJqueryWorking = "Not working";

  ngOnInit() {
    $(document).ready(function(){
      $('select').formSelect();

      $('select').on('change', function(this: any) {
        console.log(this.value);
      });
    });
  }

  mapOptions: google.maps.MapOptions = {
    center: { lat: -25.781951024040037, lng: 28.338064949199595 },
    zoom: 16,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: false
  };
}
