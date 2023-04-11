import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { RequestRouting } from 'src/app/shared/constants/request-routing';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
   this.baseUrl = environment.link + RequestRouting.Services.Donation.DONATION;
   this.headers.set("Origin", "http://localhost:4200");
   this.headers.set("Host", "http://localhost:4200");
  }

  async createDonation(donation: Donation): Promise<any> {
    const req = new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "create", donation, { headers: this.headers }).subscribe({
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
      this.http.get(this.baseUrl + "readOne?id=" + id, { headers: this.headers }).subscribe({
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
      this.http.get(this.baseUrl + "readAll", { headers: this.headers }).subscribe({
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
      this.http.get(this.baseUrl + "readAllByUserId?userId=" + userId, { headers: this.headers }).subscribe({
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

  async getCurrentAndUpcomingDonationsByUserId(id: string): Promise<Donation[] | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "readCurrentAndUpcomingByUserId?userId=" + id, { headers: this.headers }).subscribe({
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
      console.error("[DONATION SERVICE] getCurrentAndUpcomingDonationsByUserId() error", e);
    }
    return null;
  }

  async deleteDonation(donationId: string) {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "delete?id=" + donationId, { headers: this.headers }).subscribe({
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

  isCurrentDonationByDonation(donation: Donation): boolean {
    const donationArr: Donation[] = [];
    donationArr.push(donation);
    return this.isCurrentDonationByDonationArray(donationArr);
  }

  isCurrentDonationByDonationArray(donations: Donation[]): boolean {
    // check if donation start time is previous to now and if end time is not yet reached
    for(const donation of donations) {
      const now = new Date().toTimeString().split(' ')[0];
      const donationDate = new Date(donation.donationdate);
      const today = new Date();
      if(donationDate.getFullYear() == today.getFullYear() &&
      donationDate.getMonth() == today.getMonth() &&
      donationDate.getDay() == today.getDay() &&
      donation.starttime < now && now < donation.endtime) {
        // donation is current
        return true;
      }
    }
    return false;
  }

  isUpcomingDonationByDonation(donation: Donation): boolean {
    const donationArr: Donation[] = [];
    donationArr.push(donation);
    return this.isUpcomingDonationByDonationArray(donationArr);
  }

  isUpcomingDonationByDonationArray(donations: Donation[]): boolean {
    // check if donation start time is after now
    for(const donation of donations) {
      const now = new Date().toTimeString().split(' ')[0];
      const donationDate = new Date(donation.donationdate);
      const today = new Date();
      if(donationDate.getFullYear() == today.getFullYear() &&
      donationDate.getMonth() == today.getMonth() &&
      donationDate.getDay() == today.getDay() &&
      donation.starttime > now) {
        // donationDate is today or in the future and start time is in the future
        return true;
      }
    }
    return false;
  }
}
