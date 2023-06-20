import { Component } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { Tag } from 'src/app/models/tag.model';
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
  currentDonationCounter = 0;
  selectedDonation: Donation | null = null;
  reservedRecipients: string[] = [];
  currentRecipient = '';
  chips: Tag[] = [];

  constructor(
    public dateUtil: DateUtil,
    public sidenavService: SidenavService,
    public donationService: DonationService,
    private authenticationService: AuthenticationService
  ) {
    this.chips = [];

    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if (user != null) {
        this.donationService.getCurrentAndUpcomingDonationsByUserId(user.id).then((donations) => {
          if (donations != null) {
            $('.noCurrent').removeClass('button_text--loading');
            $('.noCurrent').removeClass('button--loading');
            $('.noCurrent').css('display', 'none');
            this.currentAndUpcomingDonations = donations;
          }
          $('.noCurrentTxt').css('visibility', 'visible');
          $('.button_text').css('display', 'none');
        }).catch((err) => {
          console.error(err);
        });

        this.donationService.getPastDonationsByUserId(user.id).then((donations) => {
          if (donations != null) {
            $('.noPast').removeClass('button_text--loading');
            $('.noPast').removeClass('button--loading');
            $('.noPast').css('display', 'none');
            this.pastDonations = donations;
          }
          $('.noPastTxt').css('visibility', 'visible');
          $('.button_text').css('display', 'none');
        }).catch((err) => {
          console.error(err);
        });
      }
    }).catch((err) => {
      console.error(err);
    });

    $(() => {
      // loaders
      $('.noCurrent').addClass('button_text--loading');
      $('.noCurrent').addClass('button--loading');
      $('.noPast').addClass('button_text--loading');
      $('.noPast').addClass('button--loading');

      // initialize the current and upcoming donations collapsible UI component
      $('#currentCollapsible').collapsible({
        accordion: false
      });

      // initialize the past donations collapsible UI component
      $('#pastCollapsible').collapsible({
        accordion: false
      });

      // initialize the modals
      $('.modal').modal();

      setTimeout(() => {
        // initialize the dropdowns
        $('.dropdown-trigger').dropdown();
      }, 1000);
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

  getRecipient(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  addRecipientToReserved(recipientPhoneNum: string) {
    const formattedPhoneNum = recipientPhoneNum.slice(6).replace(/[ ]/g, '');
    if(!this.reservedRecipients.includes(formattedPhoneNum) && this.currentRecipient != '') {
      this.reservedRecipients.push(formattedPhoneNum);
      const chip: Tag = {
        id: '',
        name: recipientPhoneNum
      };
      this.chips.push(chip);
    }
    this.currentRecipient = '';
  }

  markAsReservedClicked(donation: Donation, e: Event) {
    //e.stopPropagation();
    this.selectedDonation = donation;
    this.reservedRecipients = [];
    this.chips = [];
  }

  /**
   * Marks the donation slot as reserved if not already reserved. If already reserved, marks the donation slot as open
   */
  markAsReserved(donation: Donation, e: Event) {
    //e.stopPropagation();

    if (donation.reserved) {
      donation.reserved = false;
      donation.recipients = [];
    } else {
      donation.reserved = true;
      donation.recipients = this.reservedRecipients;
    }

    this.donationService.updateDonation(donation).then((updatedDonation) => {
      console.log("Update Donation response: ", updatedDonation);
    }).catch((err) => {
      console.error(err);
    });
  }
}
