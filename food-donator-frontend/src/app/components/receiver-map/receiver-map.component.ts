/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit } from '@angular/core';
// import { GoogleMap } from '@angular/google-maps';
import M from 'materialize-css';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';

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

  donors: User[] = [];

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

  constructor(private userService: UserService) {
    this.userService.getDonors().then((donors: User[] | null) => {
      if(donors != null) {
        this.donors = donors;
        const donorSelect = document.querySelector("#donorInnerSelect") as HTMLSelectElement;
        donors.forEach((donor: User) => {
          this.markers.push({
            position: {
              lat: donor.lat!,
              lng: donor.lon!
            },
            label: {
              color: 'red',
              text: donor.name!,
            },
            title: donor.name!,
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
