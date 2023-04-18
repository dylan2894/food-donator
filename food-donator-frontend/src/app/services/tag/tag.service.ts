import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';
import { RequestRouting } from 'src/app/shared/constants/request-routing';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.baseUrl = environment.link + RequestRouting.Services.Tag.TAG;
    this.headers.set("Origin", environment.frontend);
    this.headers.set("Host", environment.frontend);
  }

  async getTags(): Promise<Tag[] | null> {
    const req = new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + RequestRouting.Services.Tag.READ_ALL, { headers: this.headers }).subscribe({
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
      console.error("[TAG SERVICE] getTags() error", e);
    }
    return null;
  }
}
