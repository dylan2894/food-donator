import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
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

  async createDonation(donation: Donation): Promise<any> {
    const req = new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/create", donation, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const resp = await req;
      return resp;
    } catch(e) {
      console.error("[DONATION SERVICE] createDonation() error", e);
    }
    return null;
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

  async deleteDonation(donationId: string) {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "/delete?id=" + donationId, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const resp = await req;
      return resp;
    } catch(e) {
      console.error("[DONATION SERVICE] deleteDonation() error", e);
    }
    return null;
  }

  isCurrentDonation(donations: Donation[]): boolean {
    // check if donation start time is previous to now and if end time is not yet reached
    for(const donation of donations) {
      console.log("isCurrentDonation donation start time: ", donation.starttime);
      console.log("isCurrentDonation donation end time: ", donation.endtime);

      const now = new Date().toTimeString().split(' ')[0];
      console.log("isCurrentDonation now: ", now);
      //TODO compare date as well
      if(donation.starttime < now && now < donation.endtime) {
        // donation is current
        return true;
      }
    }
    return false;
  }

  isUpcomingDonation(donations: Donation[]): boolean {
    // check if donation start time is after now
    for(const donation of donations) {
      console.log("isPendingDonation donation start time: ", donation.starttime);
      console.log("isPendingDonation donation end time: ", donation.endtime);

      const now = new Date().toTimeString().split(' ')[0];
      console.log("isPendingDonation now: ", now);
      //TODO compare date as well
      if(donation.starttime > now) {
        // donation is upcoming
        return true;
      }
    }
    return false;
  }
}
