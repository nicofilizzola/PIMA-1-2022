import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable()
export class GcalInterceptor implements HttpInterceptor {
  constructor(private _oAuthService: OAuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.includes('accounts.google')) {
      let modifiedReq = req.clone({
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this._oAuthService.getAccessToken(),
        }),
      });
      return next.handle(modifiedReq);
    }
    return next.handle(req)
  }
}
