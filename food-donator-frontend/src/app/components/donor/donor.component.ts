import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent {
  currentRoute: string | null | undefined;

  constructor(private router: Router) {
    this.currentRoute = this.router.url;
  }
}
