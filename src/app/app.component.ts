import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GapiService } from './shared/services/gapi/gapi.service';
import { GcalHttpService } from './shared/services/gcal/gcal-http/gcal-http.service';
import { PercentageService } from './shared/services/percentage/percentage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly _gapiService: GapiService,
    private readonly _gcalHttpService: GcalHttpService,
    private per: PercentageService
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
      this._gcalHttpService.fetchData();
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
