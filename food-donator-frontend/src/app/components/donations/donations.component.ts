import { Component } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import { Constants } from 'src/app/shared/constants/constants';
import DateUtil from 'src/app/utils/DateUtil';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent {
  currentUser: User|null = null;
  currentDonations: Donation[] | null = [];

  constructor(
    public donationService: DonationService,
    public dateUtil: DateUtil,
    private authenticationService: AuthenticationService,
  ) {
    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.currentUser = user;
        this.donationService.getDonations().then((donations) => {
          this.currentDonations = donations;
        });
      }
    });

    $(() => {
      $('#doneeContainer').addClass('pushSidenav');
    });
  }
}
