import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUserInput } from 'src/app/models/inputs/register-user-input.model';
import { RequestRouting } from 'src/app/shared/constants/request-routing';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    //TODO update url to point to backend
    this.baseUrl = environment.link + RequestRouting.Services.Registration.REGISTRATION;
    this.headers.set("Origin", "http://localhost:4200");
    this.headers.set("Host", "http://localhost:4200");
  }

  async registerUser(user: RegisterUserInput): Promise<void> {
    const req = new Promise((resolve, reject) => {
      this.http.post<string|null>(this.baseUrl + "user", user, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const response = await req as Map<string, string>
      const json = JSON.parse(JSON.stringify(response));
      console.log("[REGISTRATION SERVICE] registerDonor()", json);
    } catch (e) {
      console.error(e);
    }
  }
}
