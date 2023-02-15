import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterDoneeInput } from 'src/app/models/inputs/register-donee-input.model';
import { RegisterDonorInput } from 'src/app/models/inputs/register-donor-input.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    //TODO update url to point to backend
    this.baseUrl = "http://localhost:8080/register/";
    this.headers.set("Origin", "http://localhost:4200");
    this.headers.set("Host", "http://localhost:4200");
  }

  async registerDonor(donor: RegisterDonorInput): Promise<void> {
    const req = new Promise((resolve, reject) => {
      this.http.post<string|null>(this.baseUrl + "donor", donor, { headers: this.headers }).subscribe({
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

  async registerDonee(donee: RegisterDoneeInput): Promise<void> {
    const req = new Promise((resolve, reject) => {
      this.http.post<string|null>(this.baseUrl + "donee", donee, { headers: this.headers }).subscribe({
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
      console.log("[REGISTRATION SERVICE] registerDonee()", json);
    } catch (e) {
      console.error(e);
    }
  }
}
