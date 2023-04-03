/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { IMarker } from 'src/app/models/Imarker.model';
import { CenterMapInput } from 'src/app/models/inputs/center-map-input.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import PhoneNumUtil from 'src/app/utils/PhoneNumUtil';

@Component({
  selector: 'app-donor-settings',
  templateUrl: './donor-settings.component.html',
  styleUrls: ['./donor-settings.component.css']
})
export class DonorSettingsComponent {
  @ViewChild(GoogleMap) map!: GoogleMap;
  mapOptions: google.maps.MapOptions;
  nameCheck = false;
  phoneNumCheck = false;
  currentUser: User | null = null;
  userMarker: IMarker | null = null;
  editDetailsForm: FormGroup;
  // styles to hide pins (points of interest) and declutter the map
  styles: Record<string, google.maps.MapTypeStyle[]> = {
    hide: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      }
    ],
  };

  constructor(
    public phoneNumUtil: PhoneNumUtil,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
    ) {
    const jwt = window.sessionStorage.getItem('food-donator-token');
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.currentUser = user;
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
      styles: this.styles['hide']
    };
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
}
