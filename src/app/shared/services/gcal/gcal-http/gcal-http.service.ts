import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs';
import {
  GcalCalendarList,
  GcalCalendarListEntry,
} from 'src/app/models/calendar-list.model';
import {
  GcalEvent,
  GcalEventInstances,
  GcalEventList,
} from 'src/app/models/event.model';
import { GcalCalendarListListResponse } from 'src/app/models/gcal-response/calendar-list/calendar-list.list.model';
import { GcalEventListResponse } from 'src/app/models/gcal-response/event/event.list.model';
import { GcalEventInstancesResponse } from 'src/app/models/gcal-response/event/event.list.model copy';
import { GcalStorageService } from '../gcal-storage/gcal-storage.service';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

/**
 * @note Gcal stands for Google Calendar
 */
@Injectable({
  providedIn: 'root',
})
export class GcalHttpService {
  constructor(
    private _http: HttpClient,
    private _gcalStorageService: GcalStorageService
  ) {}

  /**
   * @brief Runs the **CalendarList.list** method
   * @note Only passes on non all-day-inherent calendars
   */
  fetchCalendarList(): void {
    this._http
      .get(`${GOOGLE_CALENDAR_API}/users/me/calendarList`)
      .subscribe((response: GcalCalendarListListResponse) => {
        let timedCalendarList: GcalCalendarList = this._removeAllDayCLEs(
          response.items
        );
        return this._gcalStorageService.calendarList$.next(timedCalendarList);
      });
  }

  /**
   * @brief Runs the **Events.list** method
   * @note Only passes on timed events from one year ago to one year from today
   */
  fetchCalendarEvents(calendarId: string) {
    let today = new Date();
    const oneYearAgo = new Date(
      today.setFullYear(new Date().getFullYear() - 1)
    ).toISOString();
    const oneYearFromToday = new Date(
      today.setFullYear(new Date().getFullYear() + 1)
    ).toISOString();

    this._http
      .get(`${GOOGLE_CALENDAR_API}/calendars/${calendarId}/events`, {
        params: {
          timeMin: oneYearAgo,
          timeMax: oneYearFromToday,
          maxResults: 2500,
        },
      })
      .pipe(first())
      .subscribe((response: GcalEventListResponse) => {
        let calendarEvents = <GcalEventList>{
          ...this._gcalStorageService.eventList$.getValue(),
        };

        if (response.items.length === 0) {
          calendarEvents[calendarId] = [];
        } else {
          let timedEvents = this._removeInvalidEvents(response.items);
          calendarEvents[calendarId] = timedEvents;
        }

        return this._gcalStorageService.eventList$.next(calendarEvents);
      });
  }

  /**
   * @brief Runs the **Events.instances method**
   */
  fetchRecurringEventInstances(calendarId: string, recurringEventId: string) {
    this._http
      .get(
        `${GOOGLE_CALENDAR_API}/calendars/${calendarId}/events/${recurringEventId}/instances`
      )
      .pipe(first())
      .subscribe((response: GcalEventInstancesResponse) => {
        let currentEventInstances =
          this._gcalStorageService.eventInstances$.getValue();
        let newEventInstances = {};

        if (currentEventInstances != null) {
          newEventInstances = <GcalEventInstances>{ ...currentEventInstances };
        }

        newEventInstances[calendarId] = {};
        newEventInstances[calendarId][recurringEventId] = response.items;

        return this._gcalStorageService.eventInstances$.next(
          <GcalEventInstances>newEventInstances
        );
      });
  }

  /**
   * @note CLE stands for CalendarListEntry
   * @note _all-day event_: only **date** properties, no **dateTime**
   * @see _fetchCalendarList
   */
  private _removeAllDayCLEs(calendarList: GcalCalendarList): GcalCalendarList {
    let holidaylessCL = this._removeHolidayCLEs(calendarList);
    return this._removeBirthdayCLEs(holidaylessCL);
  }
  private _removeHolidayCLEs(calendarList: GcalCalendarList): GcalCalendarList {
    return calendarList.filter(
      (calendarListEntry: GcalCalendarListEntry) =>
        !calendarListEntry.id.includes('#holiday')
    );
  }
  private _removeBirthdayCLEs(
    calendarList: GcalCalendarList
  ): GcalCalendarList {
    return calendarList.filter(
      (calendarListEntry: GcalCalendarListEntry) =>
        !calendarListEntry.id.includes('#contacts')
    );
  }

  /**
   * @note removes all-day and cancelled events
   * @see _fetchCalendarEvents
   */
  private _removeInvalidEvents(events: GcalEvent[]): GcalEvent[] {
    return events.filter((event: GcalEvent) => !this._isInvalidEvent(event));
  }
  private _isInvalidEvent(event: GcalEvent): boolean {
    return this._isCancelledEvent(event) || !this._isTimedEvent(event);
  }
  private _isCancelledEvent(event: GcalEvent): boolean {
    return event.status === 'cancelled';
  }
  private _isTimedEvent(event: GcalEvent): boolean {
    return 'dateTime' in event.start;
  }
}
