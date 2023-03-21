import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginInput } from 'src/app/models/inputs/login-input.model';
import { RegisterUserInput } from 'src/app/models/inputs/register-user-input.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { UserService } from 'src/app/services/user/user.service';

export interface Coords {
  lat: number,
  lon: number
}

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  isDonor = false;
  location: Coords | null = null;

  loginForm: FormGroup;
  registerForm: FormGroup;
  invalidRegisterForm = false;
  invalidLoginForm = false;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private registrationService: RegistrationService, private router: Router, private userService: UserService) {
    this.loginForm = fb.group({
      phone_num: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.registerForm = fb.group({
      name: new FormControl('', [Validators.required]),
      phone_num: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required])
    });

    this.registerForm.controls['confirmPassword'].addValidators(
      this.validateConfirmedPassword(this.registerForm.controls['password'], this.registerForm.controls['confirmPassword'])
    );

    $(document).ready(() => {
      $('.tabs').tabs();
      $('.input').html('');

      $('#donorCheckbox').on('click', () => {
        this.isDonor = true;
      });

      $('#doneeCheckbox').on('click', () => {
        this.isDonor = false;
      });

      //$('#phoneNumInp').mask('(000) 000-0000');
    });
  }

  async login() {
    const phoneNumCtrl = this.loginForm.controls['phone_num'];
    const passwordCtrl = this.loginForm.controls['password']
    if(this.loginForm.valid) {
      this.invalidLoginForm = false;
      const input: LoginInput = {
        phone_num: phoneNumCtrl.value,
        password: passwordCtrl.value
      }
      try {
        await this.authService.login(input);
        const user = await this.userService.getUserByPhoneNum(phoneNumCtrl.value);
        if(user != null) {
          if(user.type === 'donor') {
            this.router.navigateByUrl('/dashboard');
            return;
          } else if(user.type === 'donee') {
            this.router.navigateByUrl('/map');
            return;
          }
        }
        console.error("[LOGIN-REG COMPONENT] login() getUserByPhoneNum() user is null.");
      } catch(e) {
        console.error("Cannot login: ", e);
        M.toast({html: 'Incorrect details. Cannot sign in.'})
      }

      //TODO redirect user accordingly if donor or donee
      //this.router.navigateByUrl('/dashboard');
      return;
    }
    this.invalidLoginForm = true;
  }

  async register() {
    console.log('hereeee')
    const phoneNumCtrl = this.registerForm.controls['phone_num'];
    const passwordCtrl = this.registerForm.controls['password'];
    const typeOfUserCtrl = this.registerForm.controls['type'];
    const nameCtrl = this.registerForm.controls['name'];
    if(this.registerForm.valid && this.registerForm.controls['confirmPassword'].valid) {

      if(typeOfUserCtrl.value == 'donor' && this.location == null){
        this.invalidRegisterForm = true;
        return;
      }


      this.invalidRegisterForm = false;

      try {
        const input: RegisterUserInput = {
          name: nameCtrl.value,
          type: typeOfUserCtrl.value,
          phone_num: phoneNumCtrl.value,
          password: passwordCtrl.value,
          lat: this.location?.lat,
          lon: this.location?.lon
        }

        await this.registrationService.registerUser(input);

        const loginInp: LoginInput = {
          phone_num: phoneNumCtrl.value,
          password: passwordCtrl.value
        }
        try {
          await this.authService.login(loginInp);
          if(input.type == 'donor') {
            this.router.navigateByUrl('/dashboard');
          } else {
            this.router.navigateByUrl('/map');
          }
        } catch(e) {
          console.error(e);
          M.toast({html: 'Failed to sign in.'})
        }
      } catch(e) {
        console.error(e);
        M.toast({html: 'Failed to sign in.'})
      }

      return;
    }

    this.invalidRegisterForm = true;
  }

  captureLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        }

        $('#locationBtn').addClass('successfulCapture');
        $('#locationBtn').text('Successfully captured location');
        $('#locationIcon').html('checkmark');
      });
  } else {
      alert("Geolocation is not supported by this browser.");
   }
  }

  validateConfirmedPassword(controlOne: AbstractControl, controlTwo: AbstractControl): ValidatorFn {
    return () => {
      if (controlOne.value !== controlTwo.value) {
        return { match_error: 'Value does not match' };
      }
      return null;
    }
  }

  // handleAddressChange(address: Address) {
  //   console.log(address.formatted_address)
  //   console.log(address.geometry.location.lat())
  //   console.log(address.geometry.location.lng())
  // }
}
