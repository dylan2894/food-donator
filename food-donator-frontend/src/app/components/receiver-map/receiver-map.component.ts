import { Component, OnInit } from '@angular/core';
// import { GoogleMap } from '@angular/google-maps';
import M from 'materialize-css';
import { Donor } from 'src/app/models/donor.model';
import { DonorService } from 'src/app/services/donor/donor.service';

declare const $: any

interface IMarker {
  position: {
    lat: number,
    lng: number
  },
  label: {
    color: string,
    text: string
  },
  title: string,
  info: string,
  options: {
    animation: google.maps.Animation
  }
}

@Component({
  selector: 'app-receiver-map',
  templateUrl: './receiver-map.component.html',
  styleUrls: ['./receiver-map.component.css']
})
export class ReceiverMapComponent implements OnInit {

  donors: Donor[] = [];

  // styles to hide pins (points of interest) and declutter the map
  styles: Record<string, google.maps.MapTypeStyle[]> = {
    hide: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      },
      // {
      //   featureType: "transit",
      //   elementType: "labels.icon",
      //   stylers: [{ visibility: "off" }],
      // },
    ],
  };

  mapOptions: google.maps.MapOptions = {
    center: { lat: -25.781951024040037, lng: 28.338064949199595 },
    zoom: 16,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: false,
    styles: this.styles['hide']
  };

  markers: IMarker[] = [];

  constructor(private donorService: DonorService) {
    this.donorService.getDonors().then((donors: Donor[] | null) => {
      if(donors != null) {
        this.donors = donors;
        const donorSelect = document.querySelector("#donorInnerSelect") as HTMLSelectElement;
        donors.forEach((donor: Donor) => {
          this.markers.push({
            position: {
              lat: donor.lat,
              lng: donor.lon
            },
            label: {
              color: 'red',
              // Donor name
              text: donor.name,
            },
            // Donor name?
            title: donor.name,
            info: "Donor info",
            options: {
              animation: google.maps.Animation.BOUNCE,
            },
          });
        });
      }
    });
  }

  ngOnInit() {
    $(document).ready(() => {
      // //TODO populate the donor select dropdown
      // this.donors.forEach((donor: Donor) => {
      //   console.log("HERE ");
      //   $('#donorInnerSelect').append('<option value="'+ donor.id +'">'+ donor.name +'</option>');
      // });

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

      $('.modal').modal();

      // $().on('click', () => {
      //   const modal = M.Modal.getInstance(document.querySelector('') as Element);
      // });

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

  openModal() {
    $('.modal').modal('open');
  }

}
