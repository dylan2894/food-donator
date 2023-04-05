/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { IMarker } from 'src/app/models/Imarker.model';
import { CenterMapInput } from 'src/app/models/inputs/center-map-input.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
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
    const jwt = window.sessionStorage.getItem('food-donator-token');
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        // Set the current user for rendering
        this.currentUser = user;
        console.log("Address: " + this.currentUser.address)

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

  changeName(name: string) {
    try {
      if(this.currentUser != null) {
        // set the current user's name to the new name
        this.currentUser.name = name;

        // update the current user
        this.userService.updateUser(this.currentUser).then((updateResponse) => {
            // successfully updated user
            M.toast({html: 'Successfully updated name.'})
            console.log("successfully updated name.");
            this.nameCheck = false;
        });
      }
    } catch(e) {
      console.error(e);
      M.toast({html: 'Failed to update name. Try again later.'})
      console.log("failed to update name.");
    }
  }

  changeLocation(address: string) {
    try {
      if(this.currentUser != null) {

        if(this.placeAutocompleteUtil.currentSelectedCoords === undefined) {
          //TODO add a small HTML text for validation
          return;
        }

        // set the current user's address to the new address
        this.currentUser.address = address;
        this.currentUser.lat = this.placeAutocompleteUtil.currentSelectedCoords?.lat();
        this,this.currentUser.lon = this.placeAutocompleteUtil.currentSelectedCoords?.lng();

        // update the current user
        this.userService.updateUser(this.currentUser).then((updateResponse) => {
            // successfully updated user
            M.toast({html: 'Successfully updated address.'})
            console.log("successfully updated address.");
            this.map.googleMap?.setCenter({
              lat: this.placeAutocompleteUtil.currentSelectedCoords!.lat()!,
              lng: this.placeAutocompleteUtil.currentSelectedCoords!.lng()!
            });
            this.locationCheck = false;
        });
      }
    } catch(e) {
      console.error(e);
      M.toast({html: 'Failed to update address. Try again later.'})
      console.log("failed to update address.");
    }
  }


  toggleChangeName(name: string) {



    if(this.nameCheck) {
      this.changeName(name);
      this.nameCheck = false;
      return;
    }

    this.nameCheck = true;
  }

  toggleChangeAddress(address: string) {
    if(this.locationCheck) {

      if(address == this.currentUser?.address || address == '') {
        M.toast({html: 'Successfully updated address.'})
        this.locationCheck = false;
        return;
      }

      if(this.editDetailsForm.controls.locationField.errors
        || this.placeAutocompleteUtil.currentSelectedCoords == undefined
        || this.placeAutocompleteUtil.currentSelectedAddress == undefined) {
        this.locationFieldErrors = true;
        return;
      }
      this.locationFieldErrors = false;

      this.changeLocation(address);
      document.querySelector('.pac-container')?.classList.add('invisible');
      this.locationCheck = false;
      return;
    }

    document.querySelector('.pac-container')?.classList.remove('invisible');
    this.locationCheck = true;
  }

  toggleChangePhoneNum(phoneNum: string) {
    if(this.phoneNumCheck) {

      if(phoneNum == this.currentUser?.phone_num || phoneNum == '') {
        M.toast({html: 'Successfully updated phone number.'})
        this.phoneNumCheck = false;
        return;
      }

      if(this.editDetailsForm.controls.phoneNumField.errors) {
        this.phoneNumFieldErrors = true;
        return;
      }
      this.phoneNumFieldErrors = false;

      this.newPhoneNum = phoneNum;
      $('#newPhoneNumber').text(`New phone number: ${this.phoneNumUtil.format(phoneNum)}. Save changes?`);
      $('#savePhoneNumberModal').modal('open');

      return;
    }

    this.phoneNumCheck = true;
  }

  changePhoneNum(phoneNum: string) {
    this.phoneNumCheck = false;

    try {
      if(this.currentUser != null) {
        // set the current user's phone number to the new phone number
        this.currentUser.phone_num = phoneNum;

        // update the current user
        this.userService.updateUser(this.currentUser).then((updateResponse) => {

            // successfully updated user
            M.toast({html: 'Successfully updated phone number. Please sign in again.'})
            this.phoneNumCheck = false;
        });
      }
    } catch(e) {
      console.error(e);
      M.toast({html: 'Failed to update phone number. Try again later.'})
    }
  }

  cancelEdit() {
    this.phoneNumCheck = false;
    this.nameCheck = false;
    this.locationCheck = false;
    this.editDetailsForm.controls.phoneNumField.setValue(this.currentUser?.phone_num);
    this.editDetailsForm.controls.nameField.setValue(this.currentUser?.name);
    this.editDetailsForm.controls.locationField.setValue(this.currentUser?.address);
  }
}
