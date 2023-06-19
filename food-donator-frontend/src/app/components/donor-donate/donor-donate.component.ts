import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Donation } from 'src/app/models/donation.model';
import { CreateDonationOutput } from 'src/app/models/outputs/create-donation-output.model';
import { CreateTagOutput } from 'src/app/models/outputs/create-tag-output.model';
import { Tag } from 'src/app/models/tag.model';
import { UserTag } from 'src/app/models/user-tag.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import { UserTagService } from 'src/app/services/user-tag/user-tag.service';
import { Constants } from 'src/app/shared/constants/constants';
import DateUtil from 'src/app/utils/DateUtil';

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
  tags: Tag[] = [];

  date = new Date();
  startTime = "";
  endTime = "";
  description = "";
  recurringUnit = "never";
  recurringQuantity = 1;
  donations: Donation[] = [];
  currentUser: User | null = null;

  dateForm = this.fb.group({
    dateCtrl: ['', Validators.required],
    recurringCtrl: ['']
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
    public dateUtil: DateUtil,
    private userTagService: UserTagService,
    private fb: FormBuilder,
    private donationService: DonationService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    $(() => {
      const dateOptions = {
        defaultDate: new Date()
      }
      const timeOptions: Partial<M.TimepickerOptions> = {
        defaultTime: new Date().getTime().toLocaleString(),
        twelveHour: false
      }

      // initialize materialize datepicker
      const datepicker = document.querySelector('.datepicker') as Element;
      M.Datepicker.init(datepicker, dateOptions);

      // initialize materialize timepicker
      const startTimepicker = document.querySelector('#startTime') as Element;
      M.Timepicker.init(startTimepicker, timeOptions);

      // initialize materialize timepicker
      const endTimepicker = document.querySelector('#endTime') as Element;
      M.Timepicker.init(endTimepicker, timeOptions);

      // initialize materialize select
      $('select').formSelect();

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

  setRecurringUnit(unit: string) {
    console.log(unit);
    this.recurringUnit = unit;
  }

  setRecurringQuantity(quantity: number) {
    console.log(quantity);
    this.recurringQuantity = quantity;
  }

  isDateSelected(stepper: MatStepper): void {
    this.isDateFormSubmitted = true;

    const datepicker = document.querySelector('.datepicker') as Element;
    const instance = M.Datepicker.getInstance(datepicker);
    if (instance.date != null) {
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
    if (instance.time != null) {
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
    if (instance.time != null) {
      this.endTime = instance.time;

      // check if end time is after start time
      if (this.endTime <= this.startTime) {
        this.endTimeForm.controls.endTimeCtrl.setErrors({ endTimeBeforeStartTime: true });
        return;
      }

      this.endTimeForm.controls.endTimeCtrl.setErrors(null);
      stepper.next();
      return;
    }
    this.endTimeForm.controls.endTimeCtrl.setErrors({ required: true });
  }

  updateChipSelectorState(selected: Tag[]) {
    if (selected.length > 0) {
      this.isTagsSelected = true;
      this.tags = selected;
      return;
    }

    this.isTagsSelected = false;
    this.tags = selected;
  }

  isDescriptionSelected(stepper: MatStepper): void {
    this.donations = [];
    this.isDescriptionFormSubmitted = true;

    if (this.descriptionForm.errors || !this.isTagsSelected) {
      return;
    }

    if (this.descriptionForm.controls.descriptionCtrl.value) {
      this.description = this.descriptionForm.controls.descriptionCtrl.value;
      stepper.next();
    }
  }

  updateDonations(recurringQuantity: number, recurringUnit: string, stepper: MatStepper) {
    // console.log(stepper._getFocusIndex());
    this.donations = [];
    // create donation objects and push them onto the donations array
    if(this.currentUser) {
      if(recurringUnit == 'never') {
        const donation: Donation = {
          id: "",
          userid: this.currentUser.id,
          donationdate: this.date.valueOf(),
          starttime: this.startTime,
          endtime: this.endTime,
          description: this.description,
          reserved: false,
          recipients: []
        }
        this.donations.push(donation);
        return;
      }
      for (let i = 0; i < recurringQuantity + 1; i++) {
        const theDate = new Date(this.date);
        // if recurringUnit is daily
        if (recurringUnit == 'daily') {
          theDate.setDate(theDate.getDate() + i);
        }
        // if recurringUnit is weekly
        if (recurringUnit == 'weekly') {
          theDate.setDate(theDate.getDate() + i * 7);
        }
        // if recurringUnit is monthly
        if (recurringUnit == 'monthly') {
          theDate.setMonth(theDate.getMonth() + i);
        }
        const donation: Donation = {
          id: "",
          userid: this.currentUser.id,
          donationdate: theDate.valueOf(),
          starttime: this.startTime,
          endtime: this.endTime,
          description: this.description,
          reserved: false,
          recipients: []
        }
        this.donations.push(donation);
      }
    }
  }

  onSubmitDonation() {
    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user: User | null) => {
      if (user != null) {
        const promises: Promise<void>[] = [];
        this.donations.forEach((donation) => {
          this.donationService.createDonation(donation).then((resp: CreateDonationOutput) => {
            if (resp.id != null) {
              // create tags
              for (const tag of this.tags) {
                const createUserTagInput: UserTag = {
                  tagid: tag.id,
                  donationid: resp.id
                }
                promises.push(
                  this.userTagService.createUserTag(createUserTagInput).then((createTagOutput: CreateTagOutput) => {
                    //
                  })
                );
              }
            }
          }).catch((err) => {
            console.error(err);
          });
        });

        // wait for all tags to be created
        Promise.all(promises).then(() => {
          this.router.navigateByUrl('/dashboard');
          if (this.donations.length == 1) {
            M.toast({ html: 'New donation successfully created!' })
            return;
          }
          M.toast({ html: 'New donations successfully created!' })
        }).catch(() => {
          console.error("Could not create all tags.");
          M.toast({ html: "Failed to create donation, please try again." });
        });
      }
    }).catch((err) => {
      console.error(err);
    });
  }
}
