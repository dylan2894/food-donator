import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DonorGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return this.isLoggedInDonor();
  }

  async isLoggedInDonor(): Promise<boolean> {
    // get stored JWT
    const jwt = window.sessionStorage.getItem('food-donator-token');

    if(jwt !== null && jwt !== '') {
      // validate the JWT on the server-side
      return this.authService.isJwtValidForDonor(jwt);
    }
    return false;
  }
}
