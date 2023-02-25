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
    this.baseUrl = "http://localhost:8080";
    this.headers.set("Origin", "http://localhost:4200");
    this.headers.set("Host", "http://localhost:4200");
  }

  async getUserByPhoneNum(phoneNum: string): Promise<User | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + "/user/readOneByPhoneNum?phoneNum=" + phoneNum, { headers: this.headers }).subscribe({
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
}
