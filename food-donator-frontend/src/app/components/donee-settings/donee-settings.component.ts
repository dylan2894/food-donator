import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserSettings } from 'src/app/models/inputs/user-settings.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserSettingsService } from 'src/app/services/user-settings/user-settings.service';
import { UserService } from 'src/app/services/user/user.service';
import { Constants } from 'src/app/shared/constants/constants';
import PhoneNumUtil from 'src/app/utils/PhoneNumUtil';

@Component({
  selector: 'app-donee-settings',
  templateUrl: './donee-settings.component.html',
  styleUrls: ['./donee-settings.component.css']
})
export class DoneeSettingsComponent {
  currentUser: User|null = null;
  currentUserSettings: UserSettings| null = null;
  phoneNumCheck = false;
  phoneNumFieldErrors = false;
  editDetailsForm: FormGroup;

  constructor(
    public phoneNumUtil: PhoneNumUtil,
    private fb: FormBuilder,
    private userService: UserService,
    private userSettingsService: UserSettingsService,
    private authenticationService: AuthenticationService
    ){
    this.editDetailsForm = this.fb.group({
      phoneNumField: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)])
    });

    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user) {
        this.currentUser = user;
      }
    });

    this.userSettingsService.getUserSettingsByJwt(jwt).then((userSettings) => {
      if(userSettings) {
        this.currentUserSettings = userSettings;
      }
    });
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

  showChanges() {
    $('#cancelAndSaveBtnContainer').css('display', 'flex');
  }

  async savePersonalInfoChanges(phoneNum: string) {
    try {
      if (this.changePhoneNum(phoneNum)) {
        // a field has been altered, update the user.
        if (this.currentUser) {
          const updateResponse = await this.userService.updateUser(this.currentUser);

          // successfully updated user toast
          M.toast({
            html: `
            <span class="material-symbols-outlined" style="margin-right: 8px;">check</span>
            Successfully updated your information.`
          });

          // set fields to readonly
          this.phoneNumCheck = false;

          // reset form
          this.cancelPersonalInfoChanges();
        }
      } else {
        this.cancelPersonalInfoChanges();
      }
    } catch (e) {
      console.error(e);
      M.toast({ html: 'Failed to update your information.' })
    }
  }

  cancelPersonalInfoChanges() {
    this.phoneNumCheck = false;
    this.editDetailsForm.controls.phoneNumField.setValue(this.currentUser?.phone_num);
    $('#cancelAndSaveBtnContainer').css('display', 'none');
  }

  poiSwitched() {
    if(this.currentUser?.phone_num) {
      const userSettings: UserSettings = {
        phone_num: this.currentUser?.phone_num,
        poi: !!$('#poiSwitch').prop('checked'),
        dark_map: !!this.currentUserSettings?.dark_map,
        transit: !!this.currentUserSettings?.transit,
        administrative: !!this.currentUserSettings?.administrative
      }
      this.performSettingsUpdate(userSettings);
    }
  }

  transitSwitched() {
    if(this.currentUser?.phone_num) {
      const userSettings: UserSettings = {
        phone_num: this.currentUser.phone_num,
        poi: !!this.currentUserSettings?.poi,
        dark_map: !!this.currentUserSettings?.dark_map,
        transit: !!$('#transitSwitch').prop('checked'),
        administrative: !!this.currentUserSettings?.administrative
      }
      this.performSettingsUpdate(userSettings);
    }
  }

  administrativeSwitched() {
    if(this.currentUser?.phone_num) {
      const userSettings: UserSettings = {
        phone_num: this.currentUser.phone_num,
        poi: !!this.currentUserSettings?.poi,
        dark_map: !!this.currentUserSettings?.dark_map,
        transit: !!this.currentUserSettings?.transit,
        administrative: !!$('#administrativeSwitch').prop('checked')
      }
      this.performSettingsUpdate(userSettings);
    }
  }

  darkMapSwitched() {
    if(this.currentUser?.phone_num) {
      const userSettings: UserSettings = {
        phone_num: this.currentUser.phone_num,
        poi: !!this.currentUserSettings?.poi,
        dark_map: !!$('#darkMapSwitch').prop('checked'),
        transit: !!this.currentUserSettings?.transit,
        administrative: !!this.currentUserSettings?.administrative
      }
      this.performSettingsUpdate(userSettings);
    }
  }

  async performSettingsUpdate(userSettings: UserSettings) {
    try {
      if(this.currentUser?.phone_num) {
        await this.userSettingsService.updateUserSettings(userSettings);

        // successfully updated user toast
        M.toast({
          html: `
          <span class="material-symbols-outlined" style="margin-right: 8px;">check</span>
          Successfully updated your map settings.`
        });
      }
    } catch(e) {
      console.error(e);
      M.toast({ html: 'Failed to update your map settings.' })
    }
  }
}
