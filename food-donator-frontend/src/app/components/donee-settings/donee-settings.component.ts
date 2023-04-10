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
  editDetailsForm: FormGroup;

  constructor(
    public phoneNumUtil: PhoneNumUtil,
    private fb: FormBuilder,
    private userService: UserService,
    private authenticationService: AuthenticationService
    ){
    this.editDetailsForm = this.fb.group({
      phoneNumField: new FormControl('', [Validators.required])
    });

    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.currentUser = user;
      }
    });

    $(document).ready(() => {
      $('#doneeContainer').addClass('pushSidenav');
    });
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

        console.log(this.currentUser.phone_num)
        console.log(phoneNum)

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
}
