import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CenterMapInput } from 'src/app/models/inputs/center-map-input.model';

@Component({
  selector: 'app-donee',
  templateUrl: './donee.component.html',
  styleUrls: ['./donee.component.css']
})
export class DoneeComponent {
  currentRoute: string | null | undefined;
  mapCenter: CenterMapInput | null;

  constructor(private router: Router) {
    this.currentRoute = this.router.url;
    this.mapCenter = null;
  }

  centerMapOnLocation(newCenter: CenterMapInput) {
    this.mapCenter = newCenter;
  }
}
