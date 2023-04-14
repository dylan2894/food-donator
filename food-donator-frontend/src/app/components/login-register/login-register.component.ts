import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { IMarker } from 'src/app/models/Imarker.model';
import { LoginInput } from 'src/app/models/inputs/login-input.model';
import { RegisterUserInput } from 'src/app/models/inputs/register-user-input.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { UserService } from 'src/app/services/user/user.service';
import MapUtil from 'src/app/utils/MapUtil';
import PlacesAutocompleteUtil from 'src/app/utils/PlacesAutocompleteUtil';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  @ViewChild(GoogleMap) map!: GoogleMap;
  isDonor = false;
  mapOptions: google.maps.MapOptions;
  loginForm: FormGroup;
  registerForm: FormGroup;
  invalidRegisterForm = false;
  invalidLoginForm = false;
  markers: IMarker[] = [];

  constructor(
    public placesAutocompleteUtil: PlacesAutocompleteUtil,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private registrationService: RegistrationService,
    private userService: UserService
    ) {
    this.loginForm = this.fb.group({
      phone_num: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.registerForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      phone_num: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required])
    });

    this.registerForm.controls['confirmPassword'].addValidators(
      this.validateConfirmedPassword(this.registerForm.controls['password'], this.registerForm.controls['confirmPassword'])
    );

    this.mapOptions = {
      //center: { lat: -25.781951024040037, lng: 28.338064949199595 },
      zoom: 15,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: false,
      styles: MapUtil.STYLES['hide']
    };

    $(document).ready(() => {
      $('.tabs').tabs();
      $('.input').html('');

      $('#donorCheckbox').on('click', () => {
        this.isDonor = true;
      });

      $('#doneeCheckbox').on('click', () => {
        this.isDonor = false;
      });

    });
  }

  onDonorTypeSelected() {
    // initialize Google Places Autocomplete API
    setTimeout(() => {
      this.placesAutocompleteUtil.placeAutocomplete(this.map);
    }, 1000);
  }

  async login() {
    const phoneNumCtrl = this.loginForm.controls['phone_num'];
    const passwordCtrl = this.loginForm.controls['password']
    if(this.loginForm.valid) {
      this.invalidLoginForm = false;
      $('.btn').addClass('button_text--loading');
      $('.btn').addClass('button--loading');

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
        $('.btn').removeClass('button_text--loading');
        $('.btn').removeClass('button--loading');
      }

      return;
    }
    this.invalidLoginForm = true;
  }

  async register() {
    const phoneNumCtrl = this.registerForm.controls['phone_num'];
    const passwordCtrl = this.registerForm.controls['password'];
    const typeOfUserCtrl = this.registerForm.controls['type'];
    const nameCtrl = this.registerForm.controls['name'];

    const existingUser = await this.userService.getUserByPhoneNum(phoneNumCtrl.value);

    if(existingUser) {
      this.registerForm.controls.address.setErrors({
        existingUser: true
      });
    }

    if(this.registerForm.valid
      && this.registerForm.controls['confirmPassword'].valid
      && this.placesAutocompleteUtil.currentSelectedCoords != undefined
      && this.placesAutocompleteUtil.currentSelectedAddress!= undefined
      && existingUser == null) {

      this.invalidRegisterForm = false;

      try {
        const input: RegisterUserInput = {
          name: nameCtrl.value,
          type: typeOfUserCtrl.value,
          phone_num: phoneNumCtrl.value,
          password: passwordCtrl.value,
          address: this.placesAutocompleteUtil.currentSelectedAddress,
          lat: this.placesAutocompleteUtil.currentSelectedCoords.lat(),
          lon: this.placesAutocompleteUtil.currentSelectedCoords.lng()
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

  validateConfirmedPassword(controlOne: AbstractControl, controlTwo: AbstractControl): ValidatorFn {
    return () => {
      if (controlOne.value !== controlTwo.value) {
        return { match_error: 'Value does not match' };
      }
      return null;
    }
  }
}
