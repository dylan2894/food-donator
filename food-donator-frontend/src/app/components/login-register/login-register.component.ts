import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginInput } from 'src/app/models/inputs/login-input.model';
import { RegisterDoneeInput } from 'src/app/models/inputs/register-donee-input.model';
import { RegisterDonorInput } from 'src/app/models/inputs/register-donor-input.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  invalidRegisterForm: boolean;
  invalidLoginForm: boolean;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private registrationService: RegistrationService, private router: Router) {
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
      this.router.navigateByUrl('/dashboard');
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
          //TODO introduce lat and lon UI components
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
        const loginInp: LoginInput = {
          phone_num: phoneNumCtrl.value,
          password: passwordCtrl.value
        }
        try {
          await this.authService.login(loginInp);
        } catch(e) {
          //TODO toast message informing the user of the error
          console.error(e);
        }
        this.router.navigateByUrl('/dashboard');
      } catch(e) {
        console.error(e);
        //TODO toast message informing the use of the error
      }

      return;
    }

    this.invalidRegisterForm = true;
  }
}
