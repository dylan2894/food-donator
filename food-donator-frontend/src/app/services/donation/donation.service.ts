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
   this.headers.set("Origin", environment.frontend);
   this.headers.set("Host", environment.frontend);
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

  async getCurrentAndUpcomingDonations() {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "readAllCurrentAndUpcoming", { headers: this.headers }).subscribe({
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
      console.error("[DONATION SERVICE] getCurrentAndUpcomingDonations() error", e);
    }
    return null;
  }

  async getPastDonationsByUserId(id: string): Promise<Donation[] | null> {
    try {
      const donations = await this.getDonationsByUserId(id) as Donation[];
      const pastDonations: Donation[] = [];
      return donations.filter((donation) => {

        const today = new Date();
        const now = new Date().toTimeString().split(' ')[0];
        const donationDate = new Date(donation.donationdate);
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        // if today, endtime must be before now
        if(donationDate.getFullYear() == today.getFullYear() &&
        donationDate.getMonth() == today.getMonth() &&
        donationDate.getDate() == today.getDate()) {
          if(donation.endtime < now) {
            return true;
          }
          // if today, but not yet over
          return false;
        }

        // if day is in the past or today
        if(donation.donationdate < today.getTime()) {
          return true;
        }
        return false;
      });
    } catch(e) {
      console.error("[DONATION SERVICE] getPastDonationsByUserId() error", e);
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

  /**
   * Wraps a single {@link Donation} in an array before invoking isCurrentDonationByDonationArray method.
   * @param donation A single {@link Donation}.
   * @returns True, if the donation is current. False otherwise.
   */
  isCurrentDonationByDonation(donation: Donation): boolean {
    const donationArr: Donation[] = [];
    donationArr.push(donation);
    return this.isCurrentDonationByDonationArray(donationArr);
  }

  /**
   * Checks if a {@link Donation} which has started and is current is within the supplied array.
   * @param donations An array of {@link Donation}'s
   * @returns True, if there is a currently active donation. False, if no currently active donations exist.
   */
  isCurrentDonationByDonationArray(donations: Donation[]): boolean {
    for(const donation of donations) {
      const today = new Date();
      const now = new Date().toTimeString().split(' ')[0];
      const donationDate = new Date(donation.donationdate);

      // if donation is today, start time is previous to now and end time is not yet reached.
      if(donationDate.getFullYear() == today.getFullYear() &&
      donationDate.getMonth() == today.getMonth() &&
      donationDate.getDate() == today.getDate() &&
      donation.starttime <= now && now <= donation.endtime) {
        // donation is current
        return true;
      }
    }
    return false;
  }


  /**
   * Wraps a single {@link Donation} in an array before invoking isUpcomingDonationByDonationArray method.
   * @param donation A single {@link Donation}.
   * @returns True, if the donation is upcoming. False otherwise.
   */
  isUpcomingDonationByDonation(donation: Donation): boolean {
    const donationArr: Donation[] = [];
    donationArr.push(donation);
    return this.isUpcomingDonationByDonationArray(donationArr);
  }

  /**
   * Checks if a {@link Donation} which is in the future or today but has not yet started is present within the supplied array.
   * @param donations An array of {@link Donation}'s
   * @returns True, if there is an upcoming donation in the future which has not started yet. False, if no donations upcoming donations exist.
   */
  isUpcomingDonationByDonationArray(donations: Donation[]): boolean {
    for(const donation of donations) {
      const today = new Date();
      const now = new Date().toTimeString().split(' ')[0];
      const donationDate = new Date(donation.donationdate);
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);

      if(donation.donationdate > today.getTime()) { // if day is in the future
        return true;
      }

      if(
        donationDate.getFullYear() == today.getFullYear() &&
        donationDate.getMonth() == today.getMonth() &&
        donationDate.getDate() == today.getDate() &&
        donation.starttime > now
        ) { // if today and not yet passed
        return true;
      }

    }
    return false;
  }
}
