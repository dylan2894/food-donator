import { Component } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';
import { UserTagService } from 'src/app/services/user-tag/user-tag.service';
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
  currentDonationCounter = 0;

  constructor(
    public dateUtil: DateUtil,
    public sidenavService: SidenavService,
    public donationService: DonationService,
    private authenticationService: AuthenticationService,
    private userTagService: UserTagService
  ) {
    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if (user != null) {
        this.donationService.getCurrentAndUpcomingDonationsByUserId(user.id).then((donations) => {
          if (donations != null) {
            this.currentAndUpcomingDonations = donations;
          }
        });

        this.donationService.getPastDonationsByUserId(user.id).then((donations) => {
          if (donations != null) {
            this.pastDonations = donations;
          }
        });
      }
    });

    $(() => {
      // initialize the current and upcoming donations collapsible UI component
      $('#currentCollapsible').collapsible({
        accordion: false
      });

      // initialize the past donations collapsible UI component
      $('#pastCollapsible').collapsible({
        accordion: false
      });
    });
  }

  async deleteDonation(donationId: string, e: Event) {
    e.stopPropagation();

    try {

      //TODO replace with modal popup
      if (!confirm('Are you sure you want to delete this donation?')) {
        return;
      }

      await this.donationService.deleteDonation(donationId);
      this.currentAndUpcomingDonations = this.currentAndUpcomingDonations.filter((donation) => {
        return donation.id != donationId;
      });

      this.pastDonations = this.pastDonations.filter((donation) => {
        return donation.id != donationId;
      });
    } catch (e) {
      console.error("Could not delete donation: ", e);
    }

  }
}
