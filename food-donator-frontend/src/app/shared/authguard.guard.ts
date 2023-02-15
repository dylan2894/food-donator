import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return this.isLoggedIn();
  }

  async isLoggedIn(){
    // get stored JWT
    const jwt = window.sessionStorage.getItem('food-donator-token');

    if(jwt !== null) {
      // validate the JWT on the server-side
      const valid = await this.authService.isJwtValid(jwt);
      if(valid) {
        return true;
      }
    }
    return false;
  }

}
