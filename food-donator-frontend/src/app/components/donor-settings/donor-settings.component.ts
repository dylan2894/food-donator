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
  currentUser: User | null = null;
  markers: IMarker[] = [];
  userMarker: IMarker | null = null;
  userLocation: google.maps.LatLngLiteral | null = null;
  editDetailsForm: FormGroup;

  constructor(
    public phoneNumUtil: PhoneNumUtil,
    private placeAutocompleteUtil: PlacesAutocompleteUtil,
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
      phoneNumField: new FormControl('', [Validators.required]),
      nameField: new FormControl('', [Validators.required])
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

  toggleChangeName(name: string) {
    if(this.nameCheck) {
      if(!confirm("Save name changes?")){
        this.nameCheck = false;
        this.editDetailsForm.controls.nameField.setValue(this.currentUser?.name);
        return;
      }

      this.changeName(name);
      this.nameCheck = false;
      return;
    }

    this.nameCheck = true;
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

  /**
   * Triggered when the Edit Location button is clicked
   */
  editLocation() {
    // hide Edit Location button
    $('#editLocationBtn').css('display','none');

    // show Click to Save Changes button and Cancel button
    $('#cancelLocationBtn, #saveLocationBtn').css('display', 'inline-block');

    //
  }

  captureLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }, null, {maximumAge:60000, timeout:5000, enableHighAccuracy: true });
  } else {
      alert("Geolocation is not supported by this browser. Please try a different browser.");
   }
  }

  cancelLocationEdit() {
    // hide Save Changes and Cancel button
    $('#cancelLocationBtn, #saveLocationBtn').css('display', 'none');

    // show Click to Capture New Location button
    $('#editLocationBtn').css('display','inline-block');

    // destroy map marker and panTo old location
  }

  saveLocationEdit() {
    // save captured browser location
    // reset UI
  }
}
