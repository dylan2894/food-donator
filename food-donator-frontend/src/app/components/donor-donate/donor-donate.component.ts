import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Donation } from 'src/app/models/donation.model';
import { CreateDonationOutput } from 'src/app/models/outputs/create-donation-output.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-donor-donate',
  templateUrl: './donor-donate.component.html',
  styleUrls: ['./donor-donate.component.css']
})
export class DonorDonateComponent implements OnInit {
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  isDateFormSubmitted = false;
  isStartTimeFormSubmitted = false;
  isEndTimeFormSubmitted = false;
  isDescriptionFormSubmitted = false;
  isTagsSelected = false;
  tags: string[] = [];

  date = new Date();
  startTime = "";
  endTime = "";
  description = "";

  dateForm = this.fb.group({
    dateCtrl: ['', Validators.required]
  });
  startTimeForm = this.fb.group({
    startTimeCtrl: ['', Validators.required]
  });
  endTimeForm = this.fb.group({
    endTimeCtrl: ['', Validators.required]
  });
  descriptionForm = this.fb.group({
    descriptionCtrl: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private authenticationService: AuthenticationService,
    private router: Router) {}

  ngOnInit() {
    $(() => {
      const dateOptions = {
        defaultDate: new Date()
      }
      const timeOptions: Partial<M.TimepickerOptions> = {
        defaultTime: new Date().getTime().toLocaleString(),
        twelveHour: false
      }
      const datepicker = document.querySelector('.datepicker') as Element;
      M.Datepicker.init(datepicker, dateOptions);

      const startTimepicker = document.querySelector('#startTime') as Element;
      M.Timepicker.init(startTimepicker, timeOptions);

      const endTimepicker = document.querySelector('#endTime') as Element;
      M.Timepicker.init(endTimepicker, timeOptions);

      $('.datepicker').on('change', () => {
        this.isDateFormSubmitted = false;
      });

      $('#startTime').on('change', () => {
        this.isStartTimeFormSubmitted = false;
      });

      $('#endTime').on('change', () => {
        this.isEndTimeFormSubmitted = false;
      });
    });
  }

  isDateSelected(stepper: MatStepper): void {
    this.isDateFormSubmitted = true;

    const datepicker = document.querySelector('.datepicker') as Element;
    const instance = M.Datepicker.getInstance(datepicker);
    if(instance.date != null) {
      this.date = instance.date;

      this.dateForm.controls.dateCtrl.setErrors(null);
      stepper.next();
      return;
    }
    this.dateForm.controls.dateCtrl.setErrors({ required: true });
  }

  isStartTimeSelected(stepper: MatStepper): void {
    this.isStartTimeFormSubmitted = true;

    const timepicker = document.getElementById('startTime') as Element;
    const instance = M.Timepicker.getInstance(timepicker);
    if(instance.time != null) {
      this.startTime = instance.time;

      this.startTimeForm.controls.startTimeCtrl.setErrors(null);
      stepper.next();
      return;
    }
    this.startTimeForm.controls.startTimeCtrl.setErrors({ required: true });
  }

  isEndTimeSelected(stepper: MatStepper): void {
    this.isEndTimeFormSubmitted = true;

    const timepicker = document.querySelector('#endTime') as Element;
    const instance = M.Timepicker.getInstance(timepicker);
    if(instance.time != null) {
      this.endTime = instance.time;

      // check if end time is after start time
      if(this.endTime <= this.startTime) {
        this.endTimeForm.controls.endTimeCtrl.setErrors({ endTimeBeforeStartTime: true });
        return;
      }

      this.endTimeForm.controls.endTimeCtrl.setErrors(null);
      stepper.next();
      return;
    }
    this.endTimeForm.controls.endTimeCtrl.setErrors({ required: true });
  }

  updateChipSelectorState(selected: string[]){
    if(selected.length > 0) {
      this.isTagsSelected = true;
      this.tags = selected;
      return;
    }

    this.isTagsSelected = false;
    this.tags = selected;
  }

  isDescriptionSelected(stepper: MatStepper): void {
    this.isDescriptionFormSubmitted = true;

    if(this.descriptionForm.errors || !this.isTagsSelected) {
      return;
    }

    if(this.descriptionForm.controls.descriptionCtrl.value) {
      this.description = this.descriptionForm.controls.descriptionCtrl.value;
      stepper.next();
    }
  }

  onSubmitDonation() {
    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user: User | null) => {
      if(user != null){
        const donation: Donation = {
          id: "",
          userid: user.id,
          donationdate: this.date.valueOf(),
          starttime: this.startTime,
          endtime: this.endTime,
          description: this.description
        }

        this.donationService.createDonation(donation).then((resp: CreateDonationOutput) => {
          if(resp.id != null){

            //TODO create tags
            

            this.router.navigateByUrl('/dashboard');
            M.toast({html: 'New donation successfully created!' })
            return;
          }

          M.toast({html: 'Failed to create the donation. Try again later.' })
        });
      }
    });
  }

}
