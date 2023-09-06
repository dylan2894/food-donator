import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Donation } from 'src/app/models/donation.model';
import { Tag } from 'src/app/models/tag.model';
import { User } from 'src/app/models/user.model';
import { UserTagService } from 'src/app/services/user-tag/user-tag.service';
import { UserService } from 'src/app/services/user/user.service';
import DateUtil from 'src/app/utils/DateUtil';
import PhoneNumUtil from 'src/app/utils/PhoneNumUtil';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() donorId = '';
  @Input() donation: Donation | null = null;
  @Input() isCurrent = false;
  @Input() forCarousel = false;

  tags: Tag[] | null = null;
  correspondingDonor: User | null = null;
  baseGoogleMapsDirectionsLink = "https://www.google.com/maps/dir/?api=1&travelmode=walking";
  googleMapsDirectionsLink = "";
  prefilledText = "Hi, I am contacting you from the Donator app.";

  constructor(
    public dateUtil: DateUtil,
    public phoneNumberUtil: PhoneNumUtil,
    public router: Router,
    private userService: UserService,
    private userTagService: UserTagService
  ) {

    $(() => {

      // Override carousel event listeners (preventing random scrolling when a button in a card is clicked)
      $('.carousel.carousel-slider, .card-title').on('click', (e: Event) => {
        e.stopPropagation();
      });

      // jQuery override of activator on card
      $('i:contains("more_vert")').on('click', function(this: HTMLElement, e: Event) {
        $(this).find('+ .card-reveal').removeClass('closeCard');
        $(this).find('+ .card-reveal').addClass('openCard');
      });
      // jQuery override of close icon on card-reveal
      $('i:contains("close")').on('click', function (this: HTMLElement, e: Event) {
        $(this).parent().parent().removeClass('openCard');
        $(this).parent().parent().addClass('closeCard');
      });

      // initialize chips UI component
      $('.chips').chips();

      // populate the tags on this card
      this.userTagService.getTagsByDonationId(this.donation!.id!).then((_tags) => {
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
        });
      }
    });
  }

  /**
   * When a user clicks on the donor address to receive directions to the donor
   */
  onMapsClicked() {
    if(!navigator.geolocation) {
      alert("Your browser does not support geolocation. Please use a different browser.");
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    // get current position
    navigator.geolocation.getCurrentPosition((position) => {
      let reload = false;
      if(this.router.url.includes('map')) {
        reload = true;
      }
      // go to map view and pass origin and destination as url params
      this.router.navigate(['/map'], {
        queryParams: {
          origin: this.myEncodeURIComponent(JSON.stringify([position.coords.latitude, position.coords.longitude])),
          destination: this.myEncodeURIComponent(JSON.stringify([this.correspondingDonor?.lat, this.correspondingDonor?.lon]))
        }
      }).then(() => {
      if(reload) {
        window.location.reload();
        //this.router.navigate(['/map'], { queryParamsHandling: "preserve"});
      }
      });



    }, (err) => {
      console.error(err);
    }, options);
  }

  myEncodeURIComponent(text: string): string {
    return encodeURIComponent(text);
  }

}
