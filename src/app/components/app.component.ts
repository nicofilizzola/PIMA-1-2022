import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ONE_DAY_AGO, ONE_DAY_FROM_TODAY, TODAY } from '../constants';
import { AUTH_USER_EMAIL_INIT, GapiService } from '../shared/services/gapi/gapi.service';
import { GcalRequestHandlerService } from '../shared/services/gcal/gcal-request-handler/gcal-request-handler.service';
import { GcalStorageService } from '../shared/services/gcal/gcal-storage/gcal-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  loading: boolean;

  constructor(
    private readonly _gapiService: GapiService,
    private readonly _gcalRequestHandlerService: GcalRequestHandlerService,
    private readonly _gcalStorageService: GcalStorageService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this._subscriptions.push(
      this._gapiService.authenticatedUserEmail$.subscribe(
        (authenticatedUserEmail: string) => {
          if (authenticatedUserEmail === null) {
            return window.location.reload();
          }
          if (authenticatedUserEmail !== AUTH_USER_EMAIL_INIT) {
            this._gcalRequestHandlerService.fetchData()
          }
        }
      )
    );

    const MIN_LOADING_SCREEN_TIME = 2000;
    this._subscriptions.push(
      this._gcalStorageService.dataFetched$.subscribe(() => {
        setTimeout(() => (this.loading = false), MIN_LOADING_SCREEN_TIME);

        console.log(this._gcalStorageService.getAllEventList(TODAY, ONE_DAY_FROM_TODAY))
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  onLogout() {
    this._gapiService.logOut();
  }
}
