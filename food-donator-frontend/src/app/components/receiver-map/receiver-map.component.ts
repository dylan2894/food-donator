/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import M from 'materialize-css';
import { IMarker } from 'src/app/models/Imarker.model';
import { Donation } from 'src/app/models/donation.model';
import { CenterMapInput } from 'src/app/models/inputs/center-map-input.model';
import { UserSettings } from 'src/app/models/inputs/user-settings.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';
import { UserSettingsService } from 'src/app/services/user-settings/user-settings.service';
import { UserService } from 'src/app/services/user/user.service';
import { Constants } from 'src/app/shared/constants/constants';
import DateUtil from 'src/app/utils/DateUtil';
import MapUtil from 'src/app/utils/MapUtil';
import PhoneNumUtil from 'src/app/utils/PhoneNumUtil';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const $: any

@Component({
  selector: 'app-receiver-map',
  templateUrl: './receiver-map.component.html',
  styleUrls: ['./receiver-map.component.css']
})
export class ReceiverMapComponent implements OnInit, AfterViewInit {
  @Input()
  set centerLocationInput(newCenter: CenterMapInput | null) {
    if(newCenter) {
      this.centerMapOnLocation(newCenter);
    }
  }
  @ViewChild(GoogleMap) map!: GoogleMap;
  donors: User[] = [];
  currentUser: User | null = null;
  currentUserSettings: UserSettings | null = null;
  currentDonorPosition: google.maps.LatLngLiteral | null = null;
  currentDonorName = "";
  currentDonorPhoneNum = "";
  currentDonorAddress = "";
  prefilledText = "Hi, I am contacting you from the CareBridge app.";
  currentDonorDonations: Donation[] | null = [];
  mapOptions: google.maps.MapOptions;
  center: CenterMapInput | null = null;
  markers: IMarker[] = [];
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    'suppressMarkers' : true
  });

  displayShowMoreInstructionsBtn = false;
  constructor(
    public phoneNumUtil: PhoneNumUtil,
    public dateUtil: DateUtil,
    public phoneNumberUtil: PhoneNumUtil,
    public donationService: DonationService,
    public sidenavService: SidenavService,
    public router: Router,
    public mapUtil: MapUtil,
    private userService: UserService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private userSettingsService: UserSettingsService
    ) {
    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.currentUser = user;
      }
    });

    // initialize the map options
    this.mapOptions = {
      //center: { lat: -25.781951024040037, lng: 28.338064949199595 },
      //zoom: 16,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      mapTypeControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      fullscreenControl: false
      //mapId: "efbf3e1e062eef4e"
    };

    // TODO apply the correct class of styles per map setting
    this.userSettingsService.getUserSettingsByJwt(jwt).then((userSettings) => {
      if(userSettings) {
        this.currentUserSettings = userSettings;
      }

      // set the google map options according to the user's settings
      this.mapOptions.styles = userSettings ? MapUtil.getUserMapStyles(userSettings) : null,
      this.map.googleMap?.setOptions(this.mapOptions);
    });
  }

  ngOnInit() {
    $(() => {
      //initialize the Directions API
      this.directionsRenderer.setMap(this.map.googleMap!);

      // initialize the slide in sidenav
      // $('.sidenav').sidenav();

      // ensure the materialize popout sidenav closes properly
      $( "#slide-out-donee" ).on("close", () => {
        this.closeMenu();
      });

      // initialize the popup marker modal
      $('.modal').modal({
        onOpenEnd: () => {
          // initialize the carousel once the modal is open
          $('.carousel.carousel-slider').carousel({
            noWrap: true,
            fullWidth: false,
            numVisible: 10,
            preventLoop: true,
            padding: 20,
            dist: 0
          });
          $('.carousel-slider').slider({
            full_width: false
          });
        }
      });

      // initialize the donor select filter
      $('select').formSelect();

      // initialize the floating action button
      $('.fixed-action-btn').floatingActionButton();

      // initialize the tooltips
      $('.tooltipped').tooltip();

      // initialize the tap target (Feature Discovery)
      $('.tap-target').tapTarget();
    });

    const params = this.route.snapshot.queryParams;
    if(params.origin != null && params.destination != null) {
      const origin = JSON.parse(decodeURIComponent(params.origin));
      const destination = JSON.parse(decodeURIComponent(params.destination));

      // perform directions routing
      const request = {
        origin: {
          lat: origin[0],
          lng: origin[1]
        },
        destination: {
          lat: destination[0],
          lng: destination[1]
        },
        travelMode: google.maps.TravelMode.DRIVING
      };
      this.calcRoute(request);
    } else {
      //todo clear route
      //this.directionsRenderer.set('directions', null);
    }
  }

  ngAfterViewInit(): void {
    this.userService.getDonors().then((donors: User[] | null) => {
      const promises: Promise<string | void>[] = [];

      if(donors != null) {
        donors.forEach((donor: User) => {
          const promise = new Promise<void>((resolve) => {
          // Push donors onto the markers array
          this.donationService.getCurrentAndUpcomingDonationsByNonReservedByUserId(donor.id, this.currentUser!).then((donations) => {
              let determinedColor = MapUtil.RED_MARKER;

              if(donations && this.donationService.isUpcomingDonationByDonationArray(donations)) {
                // set marker color to yellow
                determinedColor = MapUtil.YELLOW_MARKER;
              }

              if(donations && this.donationService.isCurrentDonationByDonationArray(donations)) {
                // set marker color to green
                determinedColor = MapUtil.GREEN_MARKER;
              }

              // create a marker/pin on the map for each donor
              this.markers.push({
                id: donor.id,
                phoneNum: donor.phone_num,
                address: donor.address,
                position: {
                  lat: donor.lat!,
                  lng: donor.lon!
                },
                label: {
                  color: this.currentUserSettings?.dark_map ? "#dbdbdb" : "black",
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
            }).catch(err => console.error(err) );
          });
          promises.push(promise);
        });

        // wait for all markers to be added to the markers array
        Promise.all(promises).then(() => {
          // rerender donor select with list of fetched donors
          setTimeout(() => {
            $('select').formSelect();
          }, 200);

          // set the Map bounds to encompass all the donors when the Directions API is not in use
          const params = this.route.snapshot.queryParams;
          if(params.origin == null && params.destination == null) {
            const bounds = this.mapUtil.getBoundsByMarkers(this.markers);
            this.map.googleMap?.fitBounds(bounds);
          } else {
            this.map.googleMap?.setZoom(14);
          }

          // open Feature Discovery
          $('.tap-target').tapTarget('open');

        }).catch(err => console.error(err) );
        // set the donors to be supplied in the donor select
        this.donors = donors;
      }
    }).catch(err => console.error(err) );
  }

  calcRoute(request: google.maps.DirectionsRequest) {
    this.directionsService.route(request, (result, status) => {
      if (status == 'OK') {
        // render directions polyline
        this.directionsRenderer.setDirections(result);

        // attach a marker to the origin of the Directions API route polyline
        const leg = result?.routes[0].legs[0];
        this.makeMarker( leg!.start_location, MapUtil.GREEN_MARKER, "My location" );

        // render step by step instructions
        this.directionsRenderer.setPanel(document.getElementById('directionsList'));
        this.showDirectionsList();

        return;
      }
      console.error('Failed to calculate directions route', status);
    });
  }

  /**
   * Used to attach a marker onto the Directions API route polyline
   */
  makeMarker(location: google.maps.LatLng, icon: google.maps.Icon | string, title: string) {
    const _marker = new google.maps.Marker({
      position: location,
      map: this.map.googleMap,
      title: title,
      label: {
        color: this.currentUserSettings?.dark_map ? "#dbdbdb" : "black",
        text: title,
      },
      animation: google.maps.Animation.BOUNCE,
      icon: '../../../assets/icons/blue-dot.svg' //'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAQlBMVEVMaXFCiv9Civ9Civ9Civ9Civ9Civ9Civ9Civ+Kt/9+r/9Pkv90qf9hnf9Civ9wpv9Ee/+Jtf9Gjf9/sP9Kj/9KXf+JdfukAAAACXRSTlMAGCD7088IcsuTBctUAAAAYUlEQVR4XlWOWQrAIBBDx302d73/VSu0UMxfQsgLAMSEzmGKcGRCkZylBHPyMJQmk44QIRWdVCuxlgQoRNLaoi4ILs/a9m6VszuGf4PSaX21eyD6oZ256/AHa/0L9RauOw+4XAWqGLX26QAAAABJRU5ErkJggg=='
    });
  }

  /**
   * Shows directions steps on mobile
   * */
  showDirectionsList() {
    $("#directionsList").css('display', 'block');
    this.displayShowMoreInstructionsBtn = false;
  }

  /**
   * Hides directions steps on mobile
   * */
  closeDirectionsList() {
    $("#directionsList").css('display', 'none');
    this.displayShowMoreInstructionsBtn = true;
  }

  /**
   * Centers the Google Map on the current donee user's location.
   */
  centerMapOnLocation(newCenter: CenterMapInput) {
    this.center = newCenter;
    this.map.googleMap?.panTo(this.center);
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

  openModal(donorId: string, donorName: string, donorPhoneNum: string, donorAddress: string, donorPosition: google.maps.LatLngLiteral): void {
    this.currentDonorName = donorName;
    this.currentDonorPhoneNum = donorPhoneNum;
    this.currentDonorAddress = donorAddress;
    this.currentDonorPosition = donorPosition;

    // fetch donations for this donor
    this.donationService.getCurrentAndUpcomingDonationsByNonReservedByUserId(donorId, this.currentUser!).then((donations) => {
      this.currentDonorDonations = donations;
      $("#flexContainer").css('text-align','left');
      $('.modal').modal('open');
      if(this.currentDonorDonations?.length == 0) {
        $("#flexContainer").css('text-align','center');
      }
    }).catch(err => console.error(err) );
  }

  carouselPrev(e: Event) {
    // prevent materialize from scrolling the carousel wildly
    e.stopPropagation();

    // move carousel one step
    $('.carousel').carousel('prev');
  }

  carouselNext(e: Event) {
    // prevent materialize from scrolling the carousel wildly
    e.stopPropagation();

    // move carousel one step
    $('.carousel').carousel('next');
  }

  /**
   * When a user clicks on the donor address to receive directions to the donor
   */
  onMapsClicked() {
    if(!navigator.geolocation) {
      alert("Your browser does not support geolocation. Please use a different browser.");
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    // get current position
    navigator.geolocation.getCurrentPosition((position) => {
      let reload = false;
      if(this.router.url.includes('map')) {
        reload = true;
      }
      // go to map view and pass origin and destination as url params
      this.router.navigate(['/map'], {
        queryParams: {
          origin: this.myEncodeURIComponent(JSON.stringify([position.coords.latitude, position.coords.longitude])),
          destination: this.myEncodeURIComponent(JSON.stringify([this.currentDonorPosition?.lat, this.currentDonorPosition?.lng]))
        }
      }).then(() => {
      if(reload) {
        window.location.reload();
        //this.router.navigate(['/map'], { queryParamsHandling: "preserve"});
      }
      });



    }, (err) => {
      console.error(err);
    }, options);
  }

  myEncodeURIComponent(text: string): string {
    return encodeURIComponent(text);
  }

}
