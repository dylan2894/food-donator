import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  constructor(private router: Router){}

  logout() {
    window.sessionStorage.removeItem("food-donator-token");
    this.router.navigateByUrl("/login");
  }
}
