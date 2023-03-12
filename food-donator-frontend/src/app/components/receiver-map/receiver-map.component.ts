/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
// import { GoogleMap } from '@angular/google-maps';
import M from 'materialize-css';
import { Donation } from 'src/app/models/donation.model';
import { CenterMapInput } from 'src/app/models/inputs/center-map-input.model';
import { User } from 'src/app/models/user.model';
import { DonationService } from 'src/app/services/donation/donation.service';
import { UserService } from 'src/app/services/user/user.service';

declare const $: any

interface IMarker {
  id: string,
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
export class ReceiverMapComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  donors: User[] = [];
  currentDonorName = "";
  currentDonorDonations: Donation[] | null = [];

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

  mapOptions: google.maps.MapOptions;
  center: CenterMapInput;

  markers: IMarker[] = [];
  markerOptions = {
    animation: google.maps.Animation.BOUNCE
  };

  constructor(private userService: UserService, private donationService: DonationService, private router: Router) {
    // set the google map options
    this.center = { lat: -25.781951024040037, lng: 28.338064949199595 };
    this.mapOptions = {
      //center: { lat: -25.781951024040037, lng: 28.338064949199595 },
      //zoom: 16,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: false,
      styles: this.styles['hide']
    };

    // initialize the donor select filter
    $('select').formSelect();
  }

  getBounds(markers: IMarker[]){
    let north = 0;
    let south = 0;
    let east = 0;
    let west = 0;

    for (const marker of markers){
      // set the coordinates to marker's lat and lng on the first run.
      // if the coordinates exist, get max or min depends on the coordinates.

      const lat: number = marker.position.lat;
      const lon: number = marker.position.lng;

      north = north !== 0 ? Math.max(north, lat) : lat;
      south = south !== 0 ? Math.min(south, lat) : lat;
      east = east !== 0 ? Math.max(east, lon) : lon;
      west = west !== 0 ? Math.min(west, lon) : lon;
    }

    north += 0.005;
    south -= 0.002;
    //east += 0.005;
    //west += 0.01;

    const bounds: google.maps.LatLngBoundsLiteral = { north: north!, south: south!, east: east!, west: west! };

    return bounds;
  }

  /**
   * Centers the Google Map on the selected Donor when the donor select option changes
   * @param event the event triggered by the HTML select change
   */
  async onChange(event: any) {
    const donorId: string = event.target.value;
    this.donors.forEach((donor: User) => {
      if(donor.id == donorId) {
        const newCenter: CenterMapInput = {
          lat: donor.lat!,
          lng: donor.lon!
        }
        this.center = newCenter;
        this.map.googleMap?.setCenter(this.center);
      }
    });
  }

  ngOnInit() {
    $(document).ready(() => {
      // initialize the slide in sidenav
      $('.sidenav').sidenav();

      // listeners for the slide in sidenav
      $('#hiddenMenu').mouseenter(() => {
        this.openMenu();
      });
      $('#hiddenMenu').click(() => {
        this.openMenu();
      });
      $('.sidenav').mouseleave(() => {
        this.closeMenu();
      });
      $( "#slide-out" ).on("close", () => {
        this.closeMenu();
      });
      $('*').on('click', () => {
        const sidenav = M.Sidenav.getInstance(document.querySelector('.sidenav') as Element);
        if(!sidenav.isOpen){
          $('#hiddenMenu').css('display', 'block');
        }
      });

      // initialize the popup marker modal
      $('.modal').modal();
    });
  }

  ngAfterViewInit(): void {
    this.userService.getDonors().then((donors: User[] | null) => {
      if(donors != null) {
        const donorSelect = document.querySelector("#donorInnerSelect") as HTMLSelectElement;
        donors.forEach((donor: User) => {
          // Push donors onto the markers array
          //TODO change marker colours based on whether they have 'current' donations or 'upcoming' donations or 'none'
          this.donationService.getDonationsByUserId(donor.id).then((donations) => {
            let determinedColor = "red";

            if(donations != null && this.donationService.isUpcomingDonation(donations)) {
              // set marker color to yellow
              determinedColor = "yellow";
            }
            else if(donations != null && this.donationService.isCurrentDonation(donations)) {
              // set marker color to green
              determinedColor = "green";
            }

            this.markers.push({
              id: donor.id,
              position: {
                lat: donor.lat!,
                lng: donor.lon!
              },
              label: {
                color: determinedColor,
                text: donor.name!,
              },
              title: donor.name!,
              info: "Donor info",
              options: {
                animation: google.maps.Animation.BOUNCE,
              },
            });
          });
        });
        // set the donors to be supplied in the donor select
        this.donors = donors;
      }

      // rerender donor select with list of fetched donors
      setTimeout(() => {
        $('select').formSelect();
      }, 200);

      // set the Map bounds to encompass all the donors
      const bounds = this.getBounds(this.markers);
      this.map.googleMap?.fitBounds(bounds);
    });
  }

  logout(): void {
    window.sessionStorage.removeItem("food-donator-token");
    this.closeMenu();
    this.router.navigateByUrl("/login");
  }

  openMenu(): void {
    const sidenav = M.Sidenav.getInstance(document.querySelector('.sidenav') as Element);
    sidenav.open();
    $('#hiddenMenu').css('display', 'none');
  }

  closeMenu(): void {
    const sidenav = M.Sidenav.getInstance(document.querySelector('.sidenav') as Element);
    sidenav.close();
    $('#hiddenMenu').css('display', 'block');
  }

  openModal(donorId: string, donorName: string): void {
    this.currentDonorName = donorName;
    $('.modal').modal('open');

    // fetch donations for this clicked donor
    this.donationService.getDonationsByUserId(donorId).then((donations) => {
      // this populates the donation schedule table
      this.currentDonorDonations = donations;
    });
  }
}
