import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { RequestRouting } from 'src/app/shared/constants/request-routing';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    //TODO inject base url
    this.baseUrl = environment.link + RequestRouting.Services.User.USER;
    this.headers.set("Origin", "http://localhost:4200");
    this.headers.set("Host", "http://localhost:4200");
  }

  async getUser(id: string): Promise<User | null> {
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
      const resp = await req as User;
      return resp;
    } catch(e) {
      console.error("[USER SERVICE] getUser() error", e);
    }
    return null;
  }

  async getUserByPhoneNum(phoneNum: string): Promise<User | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "readOneByPhoneNum?phoneNum=" + phoneNum, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const resp = await req as User;
      return resp;
    } catch(e) {
      console.error("[USER SERVICE] getUserByPhoneNum() error", e);
    }
    return null;
  }

  async getDonors(): Promise<User[] | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "readDonors", { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      return await req as User[];
    } catch(e) {
      console.error("[USER SERVICE] getDonors() error", e);
    }
    return null;
  }

  async updateUser(user: User): Promise<Map<string,object> | null> {
    const req = new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "update", user, { headers: this.headers, observe: 'response' }).subscribe({
        next: (resp) => {
          if(resp.status != 200) {
            throw new HttpErrorResponse({status: resp.status});
          }
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      return await req as Map<string, object>;
    } catch(e) {
      console.error("[USER SERVICE] updateUser() error", e);
    }
    return null;
  }

}
