import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginInput } from 'src/app/models/inputs/login-input.model';
import { ValidateJwtInput } from 'src/app/models/inputs/validate-jwt-input.model';
import { User } from 'src/app/models/user.model';
import { Constants } from 'src/app/shared/constants/constants';
import { RequestRouting } from 'src/app/shared/constants/request-routing';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    // update url to point to backend
    this.baseUrl = environment.link + RequestRouting.Services.Authentication.AUTHENTICATE;
    this.headers.set("Origin", environment.frontend);
    this.headers.set("Host", environment.frontend);
  }

  /**
   * Tries to authenticate the provided details with the server
   * and sets the JWT in session storage if successful
   * @param loginInp a {@link LoginInput} object containing the phone number and password of the user to login.
   */
  async login(loginInp: LoginInput): Promise<void> {
    const req = new Promise((resolve, reject) => {
      this.http.post<string|null>(this.baseUrl + "login", loginInp, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const response = await req as string;
      const json = JSON.parse(JSON.stringify(response));
      if(json != null && json.token !== undefined && json.token !== ''){
        // store token
        window.sessionStorage.setItem(Constants.FOOD_DONATOR_TOKEN, json.token);
        return;
      }
      console.log("[AUTH SERVICE] json response does not contain token");
    } catch(e) {
      console.error("[AUTH SERVICE] login() error", e);
      throw e;
    }
  }

  /**
   * Checks whether the provided JWT is valid on the server-side
   * @param jwt The JWT token to validate
   * @returns True if the JWT is valid. False if the JWT is invalid.
   */
  async isJwtValidForDonor(jwt: string): Promise<boolean> {
    if(jwt === "" || jwt == null) {
      return false;
    }

    const body: ValidateJwtInput = {
      jwt: jwt
    }

    const req = new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "validateJwtForDonor", body, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const response = await req as Map<string, boolean>;
      const json = JSON.parse(JSON.stringify(response));
      if(json != null && json.status != undefined) {
        if(json.status === true) {
          return true;
        }
        console.error("[AUTH SERVICE] invalid donor jwt.");
        return false;
      }
      console.error("[AUTH SERVICE] json response does not contain 'status'.");
    } catch(e) {
      console.error("[AUTH SERVICE] isJwtvalidForDonor()", e);
    }
    return false;
  }

  /**
   * Checks whether the provided JWT is valid on the server-side
   * @param jwt The JWT token to validate
   * @returns True if the JWT is valid. False if the JWT is invalid.
   */
  async isJwtValidForDonee(jwt: string): Promise<boolean> {
    if(jwt === "" || jwt === null) {
      return false;
    }

    const body: ValidateJwtInput = {
      jwt: jwt
    }

    const req = new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "validateJwtForDonee", body, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const response = await req as Map<string, boolean>;
      const json = JSON.parse(JSON.stringify(response));
      if(json != null && json.status != undefined) {
        if(json.status === true) {
          return true;
        }
        console.error("[AUTH SERVICE] invalid donee jwt.");
        return false;
      }
      console.error("[AUTH SERVICE] json response does not contain 'status'.");
    } catch(e) {
      console.error("[AUTHENTICATION SERVICE] isJwtvalidForDonee()", e);
    }
    return false;
  }

  /**
   * Gets a user by JWT
   * @param jwt the provided JWT of the user
   * @returns a {@link User} if the JWT matches, else null
   */
  async getUserByJWT(jwt: string | null): Promise<User | null> {
    const req = new Promise((resolve, reject) => {
      if(jwt == null) {
        reject(null);
      }
      this.http.post(this.baseUrl + "getUserByJWT", jwt, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const resp = await req as User | null;
      return resp;
    } catch(e) {
      console.error("[AUTHENTICATION SERVICE] getUserByJWT() error", e);
    }
    return null;
  }

  /**
   * Checks what type of user the user with the provided phone number is.
   * @param phoneNum The phone number of the user
   * @returns Either 'donor', 'donee' or 'none'
   */
  // async typeOfUser(phoneNum: string): Promise<string> {
  //   const body = {
  //     phone_num: phoneNum
  //   }
  //   const req = new Promise((resolve, reject) => {
  //     this.http.post(this.baseUrl + "type", body, { headers: this.headers }).subscribe({
  //       next: (resp) => {
  //         resolve(resp);
  //       },
  //       error: (err: HttpErrorResponse) => {
  //         reject(err);
  //       }
  //     });
  //   });

  //   try {
  //     const userTypeResponse = await req as Map<string, string>
  //     return userTypeResponse.get("type") as string;
  //   } catch(e) {
  //     console.error(e);
  //   }

  //   return "none";
  // }
}
