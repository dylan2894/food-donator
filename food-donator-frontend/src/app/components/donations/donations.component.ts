import { Component } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import DateUtil from 'src/app/utils/DateUtil';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent {
  currentUser: User|null = null;
  currentDonorDonations: Donation[] | null = [];

  constructor(
    public donationService: DonationService,
    public dateUtil: DateUtil,
    private authenticationService: AuthenticationService,
  ) {
    const jwt = window.sessionStorage.getItem('food-donator-token');
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.currentUser = user;
        this.donationService.getDonationsByUserId(this.currentUser.id).then((donations) => {
          this.currentDonorDonations = donations;
          console.log("DONATIONS: ", this.currentDonorDonations);
        });
      }
    });

    $(document).ready(() => {
      $('#doneeContainer').addClass('pushSidenav');

      // window.addEventListener('scroll', this.stickynavbar);
    });
  }

  // private stickynavbar() {
  //   const navbar = document.querySelector('.top-nav') as HTMLElement;
  //   const top = navbar.offsetTop;

  //   if (window.scrollY >= top) {
  //     navbar.classList.add('sticky');
  //   } else {
  //     navbar.classList.remove('sticky');
  //   }
  // }
}
