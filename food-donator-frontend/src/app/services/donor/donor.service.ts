import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Donor } from 'src/app/models/donor.model';


@Injectable({
  providedIn: 'root'
})
export class DonorService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    //TODO inject base url
    this.baseUrl = "http://localhost:8080";
    this.headers.set("Origin", "http://localhost:4200");
    this.headers.set("Host", "http://localhost:4200");
  }

  async getDonor(id: string): Promise<Donor | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "/donor/readOne?id=" + id, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const resp = await req as Donor;
      return resp;
    } catch(e) {
      console.error("[DONOR SERVICE] getDonor()", e);
    }
    return null;
  }

  async getDonors(): Promise<Donor[] | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "/donor/readAll", { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      return await req as Donor[];
    } catch(e) {
      console.error("[DONOR SERVICE] getDonor()", e);
    }
    return null;
  }
}
