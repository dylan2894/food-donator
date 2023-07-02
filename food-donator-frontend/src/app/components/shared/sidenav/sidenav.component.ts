import { ChangeDetectorRef, Component, Input, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Input() isDonor = false;

  constructor(private router: Router, private route: ActivatedRoute, public sidenavService: SidenavService, private cdr: ChangeDetectorRef){}

  logout() {
    window.sessionStorage.removeItem(Constants.FOOD_DONATOR_TOKEN);
    this.router.navigateByUrl("/login");
    this.sidenavService.clearOverlay();
  }

  mapClicked() {
    // this.sidenavService.clearOverlay();

    const params = this.route.snapshot.queryParams;
    if(Object.keys(params).length !== 0) {
      this.router.navigateByUrl('/map').then(() => {
        window.location.reload();
      });
    } else {
      this.router.navigateByUrl('/map')
    }
  }
}
