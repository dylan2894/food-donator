import { Component, Input, OnInit } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';
import { User } from 'src/app/models/user.model';
import { UserTagService } from 'src/app/services/user-tag/user-tag.service';
import { UserService } from 'src/app/services/user/user.service';
import PhoneNumUtil from 'src/app/utils/PhoneNumUtil';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() donorId = '';
  @Input() donationId = '';
  @Input() date = '';
  @Input() startTime = '';
  @Input() endTime = '';
  @Input() description = '';
  @Input() isCurrent = false;
  @Input() forCarousel = false;

  tags: Tag[] | null = null;
  correspondingDonor: User | null = null;
  baseGoogleMapsDirectionsLink = "https://www.google.com/maps/dir/?api=1&travelmode=walking";
  googleMapsDirectionsLink = "";
  prefilledText = "Hi, I am contacting you from the Donator app.";

  constructor(
    public phoneNumberUtil: PhoneNumUtil,
    private userService: UserService,
    private userTagService: UserTagService
  ) {
    $(() => {
      // initialize chips UI component
      $('.chips').chips();

      this.userTagService.getTagsByDonationId(this.donationId).then((_tags) => {
        if(_tags != null) {
          this.tags = _tags;
        }
      });

      // if donorId is supplied, fetch the donor which corresponds to this donation card.
      if (this.donorId != '') {
        this.userService.getUser(this.donorId).then((user) => {
          if (user != null) {
            this.correspondingDonor = user;
            this.googleMapsDirectionsLink = this.baseGoogleMapsDirectionsLink
              .concat("&destination=", user?.lat!.toString(), ",", user?.lon!.toString());
          }
          console.log("Current Donor:" + this.correspondingDonor);
        });
      }
    });
  }

  myEncodeURIComponent(text: string): string {
    return encodeURIComponent(text);
  }

}
