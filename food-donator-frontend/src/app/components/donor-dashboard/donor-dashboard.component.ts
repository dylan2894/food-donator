import { Component } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';
import { Constants } from 'src/app/shared/constants/constants';
import DateUtil from 'src/app/utils/DateUtil';

@Component({
  selector: 'app-donor-dashboard',
  templateUrl: './donor-dashboard.component.html',
  styleUrls: ['./donor-dashboard.component.css']
})
export class DonorDashboardComponent {

  currentAndUpcomingDonations: Donation[] = [];
  pastDonations: Donation[] = [];

  constructor(private donationService: DonationService,
    private authenticationService: AuthenticationService,
    public dateUtil: DateUtil,
    public sidenavService: SidenavService){
    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.donationService.getCurrentAndUpcomingDonationsByUserId(user.id).then((donations) => {
          if(donations != null) {
            this.currentAndUpcomingDonations = donations;
          }
        });

        this.donationService.getPastDonationsByUserId(user.id).then((donations) => {
          if(donations != null) {
            this.pastDonations = donations;
          }
        });
      }
    });
  }

  async deleteDonation(donationId: string) {
    try {
      await this.donationService.deleteDonation(donationId);
      this.currentAndUpcomingDonations = this.currentAndUpcomingDonations.filter((donation) => {
        return donation.id != donationId;
      });

      this.pastDonations = this.pastDonations.filter((donation) => {
        return donation.id != donationId;
      });
    } catch(e) {
      console.error("Could not delete donation: ", e);
    }

  }

}
