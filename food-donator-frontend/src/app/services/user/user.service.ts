import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    //TODO inject base url
    this.baseUrl = "http://localhost:8080/user";
    this.headers.set("Origin", "http://localhost:4200");
    this.headers.set("Host", "http://localhost:4200");
  }

  async getUser(id: string): Promise<User | null> {
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
      const resp = await req as User;
      return resp;
    } catch(e) {
      console.error("[USER SERVICE] getUser() error", e);
    }
    return null;
  }

  async getUserByPhoneNum(phoneNum: string): Promise<User | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "/readOneByPhoneNum?phoneNum=" + phoneNum, { headers: this.headers }).subscribe({
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
      console.error("[DONOR SERVICE] getUserByPhoneNum() error", e);
    }
    return null;
  }

  async getDonors(): Promise<User[] | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "/readDonors", { headers: this.headers }).subscribe({
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
      console.error("[DONOR SERVICE] getDonors() error", e);
    }
    return null;
  }

}
