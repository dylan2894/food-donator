import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Input() isDonor = false;

  constructor(private router: Router, public sidenavService: SidenavService){}

  logout() {
    window.sessionStorage.removeItem(Constants.FOOD_DONATOR_TOKEN);
    this.router.navigateByUrl("/login");
    this.sidenavService.clearOverlay();
  }
}
