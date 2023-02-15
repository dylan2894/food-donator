import { Component } from '@angular/core';
import { User } from './models/user.model';
import { AuthenticationService } from './services/authentication/authentication.service';
import { DonorService } from './services/donor/donor.service';
import { AuthguardGuard } from './shared/authguard.guard';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Food Donator';

  constructor(private donorService: DonorService, private authenticationService: AuthenticationService, private authGuard: AuthguardGuard) {
    //TODO check if user is logged in
    //TODO check if user is a donor or donee
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.authGuard.isLoggedIn();
  }

  isDonor(): boolean {
    //return await this.
    return true;
  }
}

