/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { IMarker } from 'src/app/models/Imarker.model';
import { CenterMapInput } from 'src/app/models/inputs/center-map-input.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { Constants } from 'src/app/shared/constants/constants';
import MapUtil from 'src/app/utils/MapUtil';
import PhoneNumUtil from 'src/app/utils/PhoneNumUtil';
import PlacesAutocompleteUtil from 'src/app/utils/PlacesAutocompleteUtil';

@Component({
  selector: 'app-donor-settings',
  templateUrl: './donor-settings.component.html',
  styleUrls: ['./donor-settings.component.css']
})
export class DonorSettingsComponent implements AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  mapOptions: google.maps.MapOptions;
  nameCheck = false;
  phoneNumCheck = false;
  locationCheck = false;
  currentUser: User | null = null;
  markers: IMarker[] = [];
  userMarker: IMarker | null = null;
  userLocation: google.maps.LatLngLiteral | null = null;
  editDetailsForm: FormGroup;
  phoneNumFieldErrors = false;
  locationFieldErrors = false;
  newPhoneNum: string | null = null;

  constructor(
    public phoneNumUtil: PhoneNumUtil,
    public placeAutocompleteUtil: PlacesAutocompleteUtil,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private mapUtil: MapUtil
  ) {
    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if (user != null) {
        // Set the current user for rendering
        this.currentUser = user;

        // Create a marker for the user's saved location
        this.userMarker = {
          position: {
            lat: this.currentUser.lat!,
            lng: this.currentUser.lon!
          },
          label: {
            color: "black",
            text: this.currentUser.name!
          },
          options: {
            animation: google.maps.Animation.BOUNCE
          }
        }

        // Push the user's saved location to the markers array for rendering
        this.markers.push(this.userMarker);

        // Pan the map to center the user's saved location
        const donorLocation: CenterMapInput = {
          lat: this.currentUser.lat!,
          lng: this.currentUser.lon!
        }
        this.map.googleMap?.panTo(donorLocation);
      }
    });

    this.editDetailsForm = this.fb.group({
      phoneNumField: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      nameField: new FormControl('', [Validators.required]),
      locationField: new FormControl('', [Validators.required])
    });

    this.mapOptions = {
      //center: { lat: -25.781951024040037, lng: 28.338064949199595 },
      //zoom: 16,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: false,
      styles: MapUtil.STYLES["hide"]
    };
  }

  ngAfterViewInit() {
    this.placeAutocompleteUtil.placeAutocomplete(this.map);
    setTimeout(() => {
      this.editDetailsForm.controls.locationField.setValue(this.currentUser?.address);
      const phoneNumField = document.querySelector('#phoneNum') as HTMLInputElement;
      phoneNumField.value = this.phoneNumUtil.format(this.currentUser!.phone_num!);
      // document.querySelector('#placesField')?.setAttribute('value', this.currentUser!.address!);
      document.querySelector('.pac-container')?.classList.add('invisible');
    }, 500);


    $(document).ready(() => {
      $('#saveNameModal').modal();
      $('#savePhoneNumberModal').modal();
      $('#saveAddressModal').modal();
    });
  }

  toggleChangeAddress() {
    if (this.locationCheck) {
      document.querySelector('.pac-container')?.classList.add('invisible');
      this.locationCheck = false;
      return;
    }

    $('#cancelAndSaveBtnContainer').css('display', 'flex');
    document.querySelector('.pac-container')?.classList.remove('invisible');
    this.locationCheck = true;
  }

  showChanges() {
    $('#cancelAndSaveBtnContainer').css('display', 'flex');
  }

  changePhoneNum(phoneNum: string): boolean {
    if (phoneNum == this.currentUser?.phone_num || phoneNum == '') {
      return false;
    }

    if (this.editDetailsForm.controls.phoneNumField.errors) {
      this.phoneNumFieldErrors = true;
      return false;
    }
    this.phoneNumFieldErrors = false;

    if (this.currentUser != null) {
      // set the current user's phone number to the new phone number
      this.currentUser.phone_num = phoneNum;
    }

    return true;
  }

  changeName(name: string): boolean {
    if (name == this.currentUser?.name || name == '') {
      return false;
    }

    if (this.currentUser != null) {
      // set the current user's name to the new name
      this.currentUser.name = name;
    }

    return true;
  }

  changeLocation(address: string): boolean {
    if (this.currentUser != null) {
      if (this.placeAutocompleteUtil.currentSelectedCoords === undefined) {
        return false;
      }

      if (address == null || address == '' || address == this.currentUser.address) {
        this.locationCheck = false;
        this.locationFieldErrors = true;
        return false;
      }

      if (this.editDetailsForm.controls.locationField.errors
        || this.placeAutocompleteUtil.currentSelectedCoords == undefined
        || this.placeAutocompleteUtil.currentSelectedAddress == undefined) {
        this.locationFieldErrors = true;
        return false;
      }
      this.locationFieldErrors = false;

      document.querySelector('.pac-container')?.classList.add('invisible');
      this.locationCheck = false;


      // set the current user's address to the new address
      this.currentUser.address = address;
      this.currentUser.lat = this.placeAutocompleteUtil.currentSelectedCoords?.lat();
      this.currentUser.lon = this.placeAutocompleteUtil.currentSelectedCoords?.lng();

      return true;
    }
    return false;
  }

  async saveChanges(phoneNum: string, name: string, address: string) {
    try {
      if (this.changePhoneNum(phoneNum) || this.changeName(name) || this.changeLocation(address)) {
        // a field has been altered, update the user.
        if (this.currentUser) {
          $('#cancelAndSaveBtnContainer').css('display', 'none');

          const updateResponse = await this.userService.updateUser(this.currentUser);

          // successfully updated user toast
          M.toast({
            html: `
            <span class="material-symbols-outlined" style="margin-right: 8px;">check</span>
            Successfully updated your information.`
          });

          // center map on new location
          this.map.googleMap?.setCenter({
            lat: this.currentUser.lat!,
            lng: this.currentUser.lon!
          });

          // set fields to readonly
          this.locationCheck = false;
          this.phoneNumCheck = false;
          this.nameCheck = false;
        }
      } else {
        this.cancelChanges();
      }
    } catch (e) {
      console.error(e);
      M.toast({ html: 'Failed to update your information.' })
    }
  }

  cancelChanges() {
    this.phoneNumCheck = false;
    this.nameCheck = false;
    this.locationCheck = false;
    this.editDetailsForm.controls.phoneNumField.setValue(this.currentUser?.phone_num);
    this.editDetailsForm.controls.nameField.setValue(this.currentUser?.name);
    this.editDetailsForm.controls.locationField.setValue(this.currentUser?.address);

    $('#cancelAndSaveBtnContainer').css('display', 'none');
  }
}
