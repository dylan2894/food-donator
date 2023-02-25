import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginInput } from 'src/app/models/inputs/login-input.model';
import { RegisterUserInput } from 'src/app/models/inputs/register-user-input.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { UserService } from 'src/app/services/user/user.service';

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

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private registrationService: RegistrationService, private router: Router, private userService: UserService) {
    this.loginForm = fb.group({
      phone_num: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      password: new FormControl('', [Validators.required])
    });
    this.registerForm = fb.group({
      name: new FormControl('', [Validators.required]),
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
    const phoneNumCtrl = this.registerForm.controls['phone_num'];
    const passwordCtrl = this.registerForm.controls['password'];
    const typeOfUserCtrl = this.registerForm.controls['type'];
    const nameCtrl = this.registerForm.controls['name'];
    if(this.registerForm.valid) {
      this.invalidRegisterForm = false;

      try {
        //* stubbing of lat and lon for now
        //TODO introduce lat and lon UI components
        const input: RegisterUserInput = {
          name: nameCtrl.value,
          type: typeOfUserCtrl.value,
          phone_num: phoneNumCtrl.value,
          password: passwordCtrl.value,
          lat: -25.774846046008786,
          lon: 28.269390595747705
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
}
