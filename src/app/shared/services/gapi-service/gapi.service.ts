import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId:
    '896439898675-d8gba3fj6agsnj0vkp1eu31otgfree1e.apps.googleusercontent.com',
  scope:
    'openid profile email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
};
const INIT = 'INIT_BS';
@Injectable({
  providedIn: 'root',
})
export class GapiService {
  authedUserEmail = new BehaviorSubject<string>(INIT); // infinite loop bug if initialized null

  constructor(private _oAuthService: OAuthService) {
    this._oAuthService.configure(oAuthConfig);
    this._oAuthService.loadDiscoveryDocument().then(() => {
      this._oAuthService.tryLoginImplicitFlow().then(() => {
        if (!_oAuthService.hasValidAccessToken()) {
          return this._oAuthService.initLoginFlow();
        }
        this._oAuthService.loadUserProfile().then((userProfile: any) => {
          this.authedUserEmail.next(userProfile.info.email);
        });
      });
    });
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this._oAuthService.getAccessToken(),
    });
  }

  isLoggedIn() {
    return this._oAuthService.hasValidAccessToken();
  }

  logOut() {
    this._oAuthService.logOut();
    this.authedUserEmail.next(null);
  }

  getAuthedUserEmail() {
    return this.authedUserEmail.getValue();
  }
}
