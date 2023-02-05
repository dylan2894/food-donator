import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  /**
   * Tries to authenticate the provided details with the server
   * and returns a JWT if successful
   * @return a string JWT if successful, otherwise null
   */
  login(): string | null {
    //TODO
    //this.http.post();
    return null;
  }

  /**
   * Checks whether the provided JWT is valid on the server-side
   * @returns True if the JWT is valid. False if the JWT is invalid.
   */
  isJwtValid(): boolean {
    //TODO
    return false;
  }
}
