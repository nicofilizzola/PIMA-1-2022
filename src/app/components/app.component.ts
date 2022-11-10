import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GapiService } from '../shared/services/gapi/gapi.service';
import { GcalRequestHandlerService } from '../shared/services/gcal/gcal-request-handler/gcal-request-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly _gapiService: GapiService,
    private readonly _gcalRequestHandlerService: GcalRequestHandlerService
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

    if (this._gapiService.getAuthenticatedUserEmail()) {
      this._gcalRequestHandlerService.fetchData();
    }
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
