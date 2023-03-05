import { Component } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { DonationService } from 'src/app/services/donation/donation.service';

@Component({
  selector: 'app-donor-dashboard',
  templateUrl: './donor-dashboard.component.html',
  styleUrls: ['./donor-dashboard.component.css']
})
export class DonorDashboardComponent {

  donations: Donation[] = [];

  constructor(private donationService: DonationService){
    this.donationService.getDonations().then((_donations) => {
      if(_donations != null) {
        this.donations = _donations;
      }
    });
  }

  async deleteDonation(donationId: string) {
    try {
      await this.donationService.deleteDonation(donationId);
      this.donations = this.donations.filter((donation) => { donation.id != donationId });
    } catch(e) {
      console.error("Could not delete donation: ", e);
    }

  }

}
