import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
   //TODO inject base url
   this.baseUrl = "http://localhost:8080/donation";
   this.headers.set("Origin", "http://localhost:4200");
   this.headers.set("Host", "http://localhost:4200");
  }

  async getDonation(id: string): Promise<Donation | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "/readOne?id=" + id, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const resp = await req as Donation;
      return resp;
    } catch(e) {
      console.error("[DONATION SERVICE] getDonation() error", e);
    }
    return null;
  }

  async getDonations(): Promise<Donation[] | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "/readAll", { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      return await req as Donation[];
    } catch(e) {
      console.error("[DONATION SERVICE] getDonations() error", e);
    }
    return null;
  }

  async getDonationsByUserId(userId: string): Promise<Donation[] | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "/readAllByUserId?userId=" + userId, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const resp = await req as Donation[];
      return resp;
    } catch(e) {
      console.error("[DONATION SERVICE] getDonationsByUserId() error", e);
    }
    return null;
  }
}
