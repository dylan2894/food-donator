import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.registerForm = fb.group({
      phone_num: new FormControl([Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      password: new FormControl([Validators.required]),
      donorOrDonee: new FormControl([Validators.required])
    });
  }

  ngOnInit() {
    $(document).ready(function() {
      //$('select').material_select();
    });
  }

  register() {
    //TODO try register the new user
  }

}
