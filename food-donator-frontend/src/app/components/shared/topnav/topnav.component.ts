import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CenterMapInput } from 'src/app/models/inputs/center-map-input.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';
import { Output, EventEmitter } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {
  @Output() centerLocationEvent = new EventEmitter<CenterMapInput>();

  donors: User[] = [];

  constructor(
    public router: Router,
    private userService: UserService,
    private sidenavService: SidenavService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    $(() => {
      // initialize the top nav
      $('.sidenav').sidenav();

      // initialize the dropdown
      $(".dropdown-trigger").dropdown();

      this.userService.getDonors().then((donors: User[] | null) => {
        if (donors) {
          this.donors = donors;
        }
      });

      $("#dropdown1").on("click", "li", function () {
        const clickedItemText = $(this).text();
        $('#selectDonorText').text(clickedItemText).append("<i class='material-icons right'>arrow_drop_down</i>");
      });

    });
  }

  mapClicked() {
    // this.sidenavService.clearOverlay();

    const params = this.route.snapshot.queryParams;
    if (Object.keys(params).length !== 0) {
      this.router.navigateByUrl('/map').then(() => {
        window.location.reload();
      });
    } else {
      this.router.navigateByUrl('/map')
    }
  }

  /**
 * Centers the Google Map on the selected Donor when the donor select option changes.
 * @param event the event triggered by the HTML select change.
 */
  async onChange(event: Event) {
    const donorInp = event.target as HTMLInputElement;
    const donorId = donorInp.value;
    const donor = this.donors.find((donor) => {
      return donor.id == donorId
    });
    if (donor) {
      const newCenter: CenterMapInput = {
        lat: donor.lat!,
        lng: donor.lon!
      }
      //this.center = newCenter;
      //this.map.googleMap?.panTo(this.center);
    }
  }

  /**
* Centers the Google Map on the current donee user's location.
*/
  centerMapOnMyLocation() {
    if (!navigator.geolocation) {
      alert("Your browser does not support geolocation. Please use a different browser.");
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    // get current position
    navigator.geolocation.getCurrentPosition((position) => {
      // center map on current position
      const newCenter: CenterMapInput = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      this.centerLocationEvent.emit(newCenter);
    }, (err) => {
      console.error(err);
    }, options);
  }

  onDonorSelect(selectedDonor: User) {
    const donor = this.donors.find((donor) => {
      return donor.id == selectedDonor.id
    });
    if (donor && donor.lat && donor.lon) {
      const newCenter: CenterMapInput = {
        lat: donor.lat,
        lng: donor.lon
      }
      this.centerLocationEvent.emit(newCenter);
    }
  }

  logout() {
    window.sessionStorage.removeItem(Constants.FOOD_DONATOR_TOKEN);
    this.router.navigateByUrl("/login");
    this.sidenavService.clearOverlay();
  }
}
