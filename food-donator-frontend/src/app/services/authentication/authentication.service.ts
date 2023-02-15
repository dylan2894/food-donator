import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginInput } from 'src/app/models/inputs/login-input.model';
import { ValidateJwtInput } from 'src/app/models/inputs/validate-jwt-input.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    //TODO update url to point to backend
    this.baseUrl = "http://localhost:8080/authenticate/";
    this.headers.set("Origin", "http://localhost:4200");
    this.headers.set("Host", "http://localhost:4200");
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
      //const token = response.get('token');
      if(json.token !== undefined && json.token !== ''){
        //store token
        window.sessionStorage.setItem('food-donator-token', json.token);
        return;
      }
      console.log("Login Response: ", json);
    } catch(e) {
      console.error("[AUTHENTICATION SERVICE] login()", e);
    }
  }

  /**
   * Checks whether the provided JWT is valid on the server-side
   * @param jwt The JWT token to validate
   * @returns True if the JWT is valid. False if the JWT is invalid.
   */
  async isJwtValid(jwt: string): Promise<boolean> {
    if(jwt === "") {
      return false;
    }

    const body: ValidateJwtInput = {
      jwt: jwt
    }

    const req = new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "validateJwt", body, { headers: this.headers }).subscribe({
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
      if(response.get('status') === true) {
        return true;
      }
    } catch(e) {
      console.error("[AUTHENTICATION SERVICE] isJwtvalid()", e);
    }
    return false;
  }
}
