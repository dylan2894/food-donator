import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginInput } from 'src/app/models/inputs/login-input.model';
import { RegisterDoneeInput } from 'src/app/models/inputs/register-donee-input.model';
import { RegisterDonorInput } from 'src/app/models/inputs/register-donor-input.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  invalidRegisterForm: boolean;
  invalidLoginForm: boolean;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private registrationService: RegistrationService) {
    this.loginForm = fb.group({
      phone_num: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      password: new FormControl('', [Validators.required])
    });
    this.registerForm = fb.group({
      phone_num: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      password: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required])
    });

    this.invalidRegisterForm = false;
    this.invalidLoginForm = false;

    $(function(){
      $('.tabs').tabs();
      $('.input').html('');
    });
  }

  async login() {
    const phoneNumCtrl = this.loginForm.controls['phone_num'];
    const passwordCtrl = this.loginForm.controls['password']
    if(phoneNumCtrl.errors == null && passwordCtrl.errors == null) {
      this.invalidLoginForm = false;
      const input: LoginInput = {
        phone_num: phoneNumCtrl.value,
        password: passwordCtrl.value
      }
      await this.authService.login(input);

      //TODO redirect user accordingly if donor or donee
      return;
    }
    this.invalidLoginForm = true;
  }

  async register() {
    const phoneNumCtrl = this.registerForm.controls['phone_num'];
    const passwordCtrl = this.registerForm.controls['password'];
    const typeOfUserCtrl = this.registerForm.controls['type'];
    if(this.registerForm.valid) {
      this.invalidRegisterForm = false;

      try {
        if(typeOfUserCtrl.value == 'donor') {
          //* stubbing of lat and lon for now
          const input: RegisterDonorInput = {
            phone_num: phoneNumCtrl.value,
            password: passwordCtrl.value,
            lat: -25.774846046008786,
            lon: 28.269390595747705
          }
          await this.registrationService.registerDonor(input);
        } else {
          const input: RegisterDoneeInput = {
            phone_num: phoneNumCtrl.value,
            password: passwordCtrl.value
          }
          await this.registrationService.registerDonee(input);
        }

        //TODO login and redirect user
      } catch(e) {
        console.error(e);
      }

      return;
    }

    this.invalidRegisterForm = true;
  }
}
