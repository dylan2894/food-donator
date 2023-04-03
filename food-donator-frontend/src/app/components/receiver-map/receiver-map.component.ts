/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
// import { GoogleMap } from '@angular/google-maps';
import M from 'materialize-css';
import { Donation } from 'src/app/models/donation.model';
import { CenterMapInput } from 'src/app/models/inputs/center-map-input.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import { UserService } from 'src/app/services/user/user.service';
import DateUtil from 'src/app/utils/DateUtil';
import PhoneNumUtil from 'src/app/utils/PhoneNumUtil';

declare const $: any

interface IMarker {
  id: string,
  phoneNum: string,
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
    animation: google.maps.Animation,
    icon: {
      url: string
    }
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
  editDetailsForm: FormGroup;
  phoneNumCheck = false;
  currentUser: User | null = null;
  currentDonorName = "";
  currentDonorPhoneNum = "";
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
  center: CenterMapInput | null = null;
  markers: IMarker[] = [];
  greenMarker = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
  yellowMarker = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
  redMarker = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";

  constructor(
    public phoneNumUtil: PhoneNumUtil,
    public dateUtil: DateUtil,
    public phoneNumberUtil: PhoneNumUtil,
    private userService: UserService,
    private donationService: DonationService,
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
    ) {

    const jwt = window.sessionStorage.getItem('food-donator-token');
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.currentUser = user;
      }
    });

    this.editDetailsForm = fb.group({
      phoneNumField: new FormControl('', [Validators.required])
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
      styles: this.styles['hide']
    };

    // initialize the donor select filter
    $('select').formSelect();
  }

  getBounds(){
    let north = 0;
    let south = 0;
    let east = 0;
    let west = 0;


    for (const marker of this.markers){
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
        this.map.googleMap?.panTo(this.center);
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
      $( "#slide-out-donee" ).on("close", () => {
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
      const promises: Promise<string | void>[] = [];

      if(donors != null) {
        const donorSelect = document.querySelector("#donorInnerSelect") as HTMLSelectElement;
        donors.forEach((donor: User) => {
          const promise = new Promise<void>((resolve) => {
          // Push donors onto the markers array
          this.donationService.getDonationsByUserId(donor.id).then((donations) => {
              let determinedColor = this.redMarker;

              if(donations != null && this.donationService.isUpcomingDonation(donations)) {
                // set marker color to yellow
                determinedColor = this.yellowMarker;
              }

              if(donations != null && this.donationService.isCurrentDonation(donations)) {
                // set marker color to green
                determinedColor = this.greenMarker;
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
          }, 1000); //200

          // set the Map bounds to encompass all the donors
          const bounds = this.getBounds();
          this.map.googleMap?.fitBounds(bounds);
        });
        // set the donors to be supplied in the donor select
        this.donors = donors;
      }
    });
  }

  getDirections() {
    //
  }

  toggleChangePhoneNum(phoneNum: string) {
    if(this.phoneNumCheck) {
      if(!confirm("Save phone number changes?")){
        this.phoneNumCheck = false;
        this.editDetailsForm.controls.phoneNumField.setValue(this.currentUser?.phone_num);
        return;
      }

      this.changePhoneNum(phoneNum);
      this.phoneNumCheck = false;
      return;
    }

    this.phoneNumCheck = true;
  }

  changePhoneNum(phoneNum: string) {
    try {
      if(this.currentUser != null) {

        if(this.currentUser.phone_num == phoneNum){
          M.toast({html: 'Successfully updated phone number.'})
          return;
        }

        // set the current user's phone number to the new phone number
        this.currentUser.phone_num = phoneNum;

        // update the current user
        this.userService.updateUser(this.currentUser).then((updateResponse) => {

            // successfully updated user
            M.toast({html: 'Successfully updated phone number. Please sign in again.'})
            console.log("successfully updated phone number");
            this.phoneNumCheck = false;
        });
      }
    } catch(e) {
      console.error(e);
      M.toast({html: 'Failed to update phone number. Try again later.'})
      console.log("failed to update phone number");
    }
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

  openModal(donorId: string, donorName: string, donorPhoneNum: string): void {
    this.currentDonorName = donorName;
    this.currentDonorPhoneNum = donorPhoneNum;

    $('.modal').modal('open');

    // fetch donations for this clicked donor
    this.donationService.getDonationsByUserId(donorId).then((donations) => {
      // this populates the donation schedule table
      this.currentDonorDonations = donations;
    });
  }
}
