import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DonorGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

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
      const validDonor = await this.authService.isJwtValidForDonor(jwt);
      if(!validDonor) {
        // check if this is a donee
        const validDonee = await this.authService.isJwtValidForDonee(jwt);
        if(validDonee) {
          // redirect
          this.router.navigateByUrl('/map');
          return false;
        }
      } else {
        return true;
      }
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}
