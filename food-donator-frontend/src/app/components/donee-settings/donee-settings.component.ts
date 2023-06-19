import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
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
  phoneNumCheck = false;
  phoneNumFieldErrors = false;
  editDetailsForm: FormGroup;

  constructor(
    public phoneNumUtil: PhoneNumUtil,
    private fb: FormBuilder,
    private userService: UserService,
    private authenticationService: AuthenticationService
    ){
    this.editDetailsForm = this.fb.group({
      phoneNumField: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)])
    });

    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.currentUser = user;
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

  async saveChanges(phoneNum: string) {
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
          this.cancelChanges();
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
    this.editDetailsForm.controls.phoneNumField.setValue(this.currentUser?.phone_num);
    $('#cancelAndSaveBtnContainer').css('display', 'none');
  }
}
