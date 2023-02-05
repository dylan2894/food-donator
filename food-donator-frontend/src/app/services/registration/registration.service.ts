import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  registerDonor(): void {
    //TODO
  }

  registerDonee(): void {
    //TODO
  }
}
