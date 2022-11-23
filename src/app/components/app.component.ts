import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GapiService } from '../shared/services/gapi/gapi.service';
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
    this._subscriptions.push(
      this._gapiService.authenticatedUserEmail$.subscribe(
        (authenticatedUserEmail: string) => {
          if (authenticatedUserEmail === null) {
            window.location.reload();
          }
        }
      )
    );

    this.loading = true;
    if (this._gapiService.getAuthenticatedUserEmail()) {
      // Timeout prevents sending request too soon (Avoid 401 bug)
      setTimeout(() => this._gcalRequestHandlerService.fetchData(), 100);
    }
    const MIN_LOADING_SCREEN_TIME = 2000;
    this._subscriptions.push(
      this._gcalStorageService.dataFetched$.subscribe(() => {
        setTimeout(() => (this.loading = false), MIN_LOADING_SCREEN_TIME);
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
