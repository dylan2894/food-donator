import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Input() isDonor = false;

  constructor(private router: Router, public sidenavService: SidenavService){}

  logout() {
    window.sessionStorage.removeItem("food-donator-token");
    this.router.navigateByUrl("/login");
    this.sidenavService.clearOverlay();
  }
}
