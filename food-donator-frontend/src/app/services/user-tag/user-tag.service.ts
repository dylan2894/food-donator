import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';
import { UserTag } from 'src/app/models/user-tag.model';
import { RequestRouting } from 'src/app/shared/constants/request-routing';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserTagService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.baseUrl = environment.link + RequestRouting.Services.UserTag.USER_TAG;
    this.headers.set("Origin", "http://localhost:4200");
    this.headers.set("Host", "http://localhost:4200");
  }

  async createUserTag(userTag: UserTag): Promise<any> {
    const req = new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "create", userTag, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      return await req;
    } catch(e) {
      console.error("[USER TAG SERVICE] createUserTag() error", e);
    }
    return null;
  }

  async getTagsByDonationId(donationId: string): Promise<Tag[]|null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "readTagsByDonationId?donationId=" + donationId, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      return await req as Tag[];
    } catch(e) {
      console.error("[USER TAG SERVICE] getTagsByDonationId() error", e);
    }
    return null;
  }
}
