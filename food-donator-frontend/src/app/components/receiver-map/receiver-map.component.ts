/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
// import { GoogleMap } from '@angular/google-maps';
import M from 'materialize-css';
import { IMarker } from 'src/app/models/Imarker.model';
import { Donation } from 'src/app/models/donation.model';
import { CenterMapInput } from 'src/app/models/inputs/center-map-input.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';
import { UserService } from 'src/app/services/user/user.service';
import { Constants } from 'src/app/shared/constants/constants';
import DateUtil from 'src/app/utils/DateUtil';
import MapUtil from 'src/app/utils/MapUtil';
import PhoneNumUtil from 'src/app/utils/PhoneNumUtil';

declare const $: any

@Component({
  selector: 'app-receiver-map',
  templateUrl: './receiver-map.component.html',
  styleUrls: ['./receiver-map.component.css']
})
export class ReceiverMapComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  donors: User[] = [];
  currentUser: User | null = null;
  currentDonor: User | null = null;
  currentDonorName = "";
  currentDonorPhoneNum = "";
  currentDonorDonations: Donation[] | null = [];
  baseGoogleMapsDirectionsLink = "https://www.google.com/maps/dir/?api=1&travelmode=walking";
  googleMapsDirectionsLink = "";
  mapOptions: google.maps.MapOptions;
  center: CenterMapInput | null = null;
  markers: IMarker[] = [];

  constructor(
    public phoneNumUtil: PhoneNumUtil,
    public dateUtil: DateUtil,
    public phoneNumberUtil: PhoneNumUtil,
    public donationService: DonationService,
    public sidenavService: SidenavService,
    private mapUtil: MapUtil,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
    ) {

    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.currentUser = user;
      }
    });

    // set the google map options
    //this.center = { lat: -25.781951024040037, lng: 28.338064949199595 };
    this.mapOptions = {
      //center: { lat: -25.781951024040037, lng: 28.338064949199595 },
      //zoom: 16,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: false,
      styles: MapUtil.STYLES['hide']
    };
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
        this.map.googleMap?.panTo(this.center);
      }
    });
  }

  ngOnInit() {
    $(document).ready(() => {
      // initialize the slide in sidenav
      $('.sidenav').sidenav();

      // listeners for the slide in sidenav
      // $('#hiddenMenu').mouseenter(() => {
      //   this.openMenu();
      // });
      // $('#hiddenMenu').click(() => {
      //   this.openMenu();
      // });
      // $('.sidenav').mouseleave(() => {
      //   this.closeMenu();
      // });
      $( "#slide-out-donee" ).on("close", () => {
        this.closeMenu();
      });
      // $('*').on('click', () => {
      //   const sidenavElement = document.querySelector('.sidenav') as Element;
      //   if(sidenavElement != null) {
      //     const sidenav = M.Sidenav.getInstance(sidenavElement);
      //     if(!sidenav.isOpen){
      //       $('#hiddenMenu').css('display', 'block');
      //     }
      //   }
      // });

      // initialize the popup marker modal
      $('.modal').modal({
        onOpenEnd: () => {
          // initialize the carousel once the modal is open
          $('.carousel.carousel-slider').carousel({
            noWrap: true,
            fullWidth: false,
            numVisible: 10,
            padding: 20
          });
          $('.carousel-slider').slider({ full_width: true }); //must be full_width: true for mobile
        }
      });

      // initialize the donor select filter
      $('select').formSelect();
    });
  }

  ngAfterViewInit(): void {
    this.userService.getDonors().then((donors: User[] | null) => {
      const promises: Promise<string | void>[] = [];

      if(donors != null) {
        const donorSelect = document.querySelector("#donorInnerSelect") as HTMLSelectElement;
        donors.forEach((donor: User) => {
          const promise = new Promise<void>((resolve) => {
          // Push donors onto the markers array
          this.donationService.getDonationsByUserId(donor.id).then((donations) => {
              let determinedColor = MapUtil.RED_MARKER;

              if(donations != null && this.donationService.isUpcomingDonationByDonationArray(donations)) {
                // set marker color to yellow
                determinedColor = MapUtil.YELLOW_MARKER;
              }

              if(donations != null && this.donationService.isCurrentDonationByDonationArray(donations)) {
                // set marker color to green
                determinedColor = MapUtil.GREEN_MARKER;
              }

              this.markers.push({
                id: donor.id,
                phoneNum: donor.phone_num,
                position: {
                  lat: donor.lat!,
                  lng: donor.lon!
                },
                label: {
                  color: "black",
                  text: donor.name!,
                },
                title: donor.name!,
                info: "Donor info",
                options: {
                  animation: google.maps.Animation.BOUNCE,
                  icon: {
                    url: determinedColor
                  }
                },
              });
              resolve();
            });
          });
          promises.push(promise);
        });

        // wait for all markers to be added to the markers array
        Promise.all(promises).then(() => {
          // rerender donor select with list of fetched donors
          setTimeout(() => {
            $('select').formSelect();
          }, 200); //200

          // set the Map bounds to encompass all the donors
          const bounds = this.mapUtil.getBoundsByMarkers(this.markers);
          this.map.googleMap?.fitBounds(bounds);
        });
        // set the donors to be supplied in the donor select
        this.donors = donors;
      }
    });
  }

  logout(): void {
    window.sessionStorage.removeItem(Constants.FOOD_DONATOR_TOKEN);
    this.closeMenu();
    this.router.navigateByUrl("/login");
    this.sidenavService.clearOverlay();
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

  openModal(donorId: string, donorName: string, donorPhoneNum: string): void {
    this.currentDonorName = donorName;
    this.currentDonorPhoneNum = donorPhoneNum;

    // fetch this donor's location
    this.userService.getUser(donorId).then((user) => {

      alert("Destination: " + user?.lat + ", " + user?.lon);

      this.currentDonor = user;
      this.googleMapsDirectionsLink = this.baseGoogleMapsDirectionsLink
        .concat("&destination=", user!.lat!.toString(), ",", user!.lon!.toString());
    });

    // fetch donations for this donor
    this.donationService.getDonationsByUserId(donorId).then((donations) => {
      this.currentDonorDonations = donations;
      $('.modal').modal('open');
    });
  }

  carouselPrev(e: Event) {
    e.stopPropagation();
    $('.carousel').carousel('prev');
  }

  carouselNext(e: Event) {
    e.stopPropagation();
    $('.carousel').carousel('next');
  }
}
