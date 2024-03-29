import { Component } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { Tag } from 'src/app/models/tag.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DonationService } from 'src/app/services/donation/donation.service';
import { TagService } from 'src/app/services/tag/tag.service';
import { Constants } from 'src/app/shared/constants/constants';
import DateUtil from 'src/app/utils/DateUtil';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent {
  currentUser: User|null = null;
  currentDonations: Donation[] = [];
  tempDonationsHolder: Donation[] = [];
  tags: Tag[] = [];
  chips: Tag[] = [];
  emptyFilter = false;

  constructor(
    public donationService: DonationService,
    public dateUtil: DateUtil,
    private authenticationService: AuthenticationService,
    private tagService: TagService
  ) {
    this.tagService.getTags().then((tags) => {
      if(tags != null) {
        this.chips = tags;
      }
    });

    const jwt = window.sessionStorage.getItem(Constants.FOOD_DONATOR_TOKEN);
    this.authenticationService.getUserByJWT(jwt).then((user) => {
      if(user != null) {
        this.currentUser = user;
        this.donationService.getCurrentAndUpcomingDonationsByNonReserved(this.currentUser.phone_num).then((donations) => {
          if(donations) {
            donations = donations.filter(donation => {
              return donation.userid != this.currentUser?.id;
            });
            this.currentDonations = donations;
            this.tempDonationsHolder = donations;
            $('.noCurrent').removeClass('button_text--loading');
            $('.noCurrent').removeClass('button--loading');
            $('.noCurrent').css('display','none');
          }
          $('.noCurrentTxt').css('visibility', 'visible');
          $('.button_text').css('display', 'none');
        });
      }
    });

    $(() => {
      // loaders
      $('.noCurrent').addClass('button_text--loading');
      $('.noCurrent').addClass('button--loading');
    });
  }

  async filterByChips(selected: Tag[]){
    this.emptyFilter = false;
    $(`app-card`).css('display', 'block');

    if(selected.length == 0) {
      this.currentDonations = this.tempDonationsHolder;
      return;
    }

    this.tags = selected;
    const cards = document.getElementsByTagName('app-card');
    const excludedDonationIds: string[] = [];

    // check which cards have the correct chips on them,
    // exclude cards which do not have the correct chips on them
    // by adding the corresponding donation ID onto an excludedDonationIds array.
    for(let i=0; i<cards.length; i++) {
      for(const tag of this.tags) {
        if(cards[i].innerHTML.match(new RegExp(tag.name, 'g')) == null) {
          const donationID = cards[i].getAttribute('id');
          if(donationID){
            excludedDonationIds.push(donationID);
          }
        }
      }
    }

    excludedDonationIds.forEach((donationID) => {
      $(`app-card[id^="${donationID}"]`).css('display', 'none');
    });

    // check if there are no cards displaying
    if($(`app-card:visible`).length == 0)
    {
      // no cards are currently visible, display text
      this.emptyFilter = true;
    }
  }

}
