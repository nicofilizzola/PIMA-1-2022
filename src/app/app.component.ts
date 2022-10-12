import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GapiService } from './shared/services/gapi/gapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];

  constructor(private readonly _gapiService: GapiService) {}

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
  }

  ngOnDestroy(): void {
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe()
    }
  }

  onLogout() {
    this._gapiService.logOut();
  }
}
