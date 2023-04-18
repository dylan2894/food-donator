import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donee',
  templateUrl: './donee.component.html',
  styleUrls: ['./donee.component.css']
})
export class DoneeComponent {
  currentRoute: string | null | undefined;

  constructor(private router: Router) {
    this.currentRoute = this.router.url;
  }
}
