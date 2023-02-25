import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DoneeGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLoggedInDonee();
  }

  async isLoggedInDonee(): Promise<boolean> {
    // get stored JWT
    const jwt = window.sessionStorage.getItem('food-donator-token');

    if(jwt !== null && jwt !== '') {
      // validate the JWT on the server-side
      const validDonee = await this.authService.isJwtValidForDonee(jwt);
      if(!validDonee) {
        // check if this is a donor
        const validDonor = await this.authService.isJwtValidForDonor(jwt);
        if(validDonor) {
          // redirect
          this.router.navigateByUrl('/dashboard');
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
