import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DoneeGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

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
      return this.authService.isJwtValidForDonee(jwt);
    }
    return false;
  }

}
