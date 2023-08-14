import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSettings } from 'src/app/models/inputs/user-settings.model';
import { RequestRouting } from 'src/app/shared/constants/request-routing';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  baseUrl: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.baseUrl = environment.link + RequestRouting.Services.UserSettings.USER_SETTINGS;
    this.headers.set("Origin", environment.frontend);
    this.headers.set("Host", environment.frontend);
  }

  // async setUserSettings(): Promise<Map<string, object> | null> {
  //   //TODO
  // }

  /**
   * Gets a user's settings by JWT
   * @param jwt the provided JWT of the user
   * @returns a {@link UserSettings} object if the JWT matches, else null
   */
  async getUserSettingsByJwt(jwt: string | null): Promise<UserSettings | null> {
    const req = new Promise((resolve, reject) => {
      if(jwt == null) {
        reject(null);
      }
      this.http.post(this.baseUrl + "getUserSettingsByJWT", jwt, { headers: this.headers }).subscribe({
        next: (resp) => {
          resolve(resp);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      });
    });

    try {
      const resp = await req as UserSettings | null;
      return resp;
    } catch(e) {
      console.error("[USER SETTINGS SERVICE] getUserSettingsByJWT() error", e);
    }
    return null;
  }

  /**
   * Updates a user's settings
   * @param userSettings A {@link UserSettings} object
   * @returns a {@link UserSettings} object if the JWT matches, else null
   */
  async updateUserSettings(userSettings: UserSettings): Promise<Map<string,object> | null> {
    const req = new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "update", userSettings, { headers: this.headers, observe: 'response' }).subscribe({
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
      console.error("[USER SERVICE] updateUserSettings() error", e);
    }
    return null;
  }
}
