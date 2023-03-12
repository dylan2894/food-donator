import { Component } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import DateUtil from 'src/app/utils/DateUtil';

@Component({
  selector: 'app-donor-dashboard',
  templateUrl: './donor-dashboard.component.html',
  styleUrls: ['./donor-dashboard.component.css']
})
export class DonorDashboardComponent {

  donations: Donation[] = [];

  constructor(private donationService: DonationService, private authenticationService: AuthenticationService, public dateUtil: DateUtil){
    const jwt = window.sessionStorage.getItem('food-donator-token');
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.donationService.getDonationsByUserId(user.id).then((_donations) => {
          if(_donations != null) {
            this.donations = _donations;
          }
        });
      }
    });
  }

  async deleteDonation(donationId: string) {
    try {
      await this.donationService.deleteDonation(donationId);
      this.donations = this.donations.filter((donation) => {
        return donation.id != donationId;
      });
    } catch(e) {
      console.error("Could not delete donation: ", e);
    }

  }

}
