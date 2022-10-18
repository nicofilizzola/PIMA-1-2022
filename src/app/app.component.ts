import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ONE_MONTH_AGO, ONE_WEEK_AGO } from './constants';
import { CalendarList } from './models/calendar-list.model';
import { GapiService } from './shared/services/gapi/gapi.service';
import { GcalService } from './shared/services/gcal/gcal.service';
import { PercentageService } from './shared/services/percentage/percentage.service';
import { Event } from './models/event.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly _gapiService: GapiService,
    private gcal: GcalService,
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

    this.gcal.fetchCalendarList();
    this.gcal.calendarList$.subscribe((cl) => {
      if (this.gcal.calendarList$.getValue().length > 0) {
        this.gcal.fetchCalendarEvents(cl[0].id, ONE_MONTH_AGO);
        this.gcal.fetchCalendarEvents(cl[1].id, ONE_MONTH_AGO);
        this.gcal.fetchCalendarEvents(cl[2].id, ONE_MONTH_AGO);
      }

    });
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
