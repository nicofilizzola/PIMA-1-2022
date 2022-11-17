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
 * @note Gcal stands for Google GcalCalendar
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
   * @brief Runs the **GcalCalendarList.list** method
   * @note Only passes on non all-day-inherent calendars
   */
  fetchGcalCalendarList(): void {
    this._http
      .get(`${GOOGLE_CALENDAR_API}/users/me/calendarList`)
      .subscribe((response: GcalCalendarListListResponse) => {
        let timedGcalCalendarList: GcalCalendarList = this._removeAllDayCLEs(
          response.items
        );
        return this._gcalStorageService.calendarList$.next(timedGcalCalendarList);
      });
  }

  /**
   * @brief Runs the **GcalEvents.list** method
   * @note Only passes on timed events from one year ago to one year from today
   */
  fetchGcalCalendarGcalEvents(calendarId: string) {
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
        let calendarGcalEvents = <GcalEventList>{
          ...this._gcalStorageService.eventList$.getValue(),
        };

        if (response.items.length === 0) {
          calendarGcalEvents[calendarId] = [];
        } else {
          let timedGcalEvents = this._removeInvalidGcalEvents(response.items);
          calendarGcalEvents[calendarId] = timedGcalEvents;
        }

        return this._gcalStorageService.eventList$.next(calendarGcalEvents);
      });
  }

  /**
   * @brief Runs the **GcalEvents.instances method**
   */
  fetchRecurringGcalEventInstances(calendarId: string, recurringGcalEventId: string) {
    this._http
      .get(
        `${GOOGLE_CALENDAR_API}/calendars/${calendarId}/events/${recurringGcalEventId}/instances`
      )
      .pipe(first())
      .subscribe((response: GcalEventInstancesResponse) => {
        let currentGcalEventInstances =
          this._gcalStorageService.eventInstances$.getValue();
        let newGcalEventInstances = {};

        if (currentGcalEventInstances != null) {
          newGcalEventInstances = <GcalEventInstances>{ ...currentGcalEventInstances };
        }

        newGcalEventInstances[calendarId] = {};
        newGcalEventInstances[calendarId][recurringGcalEventId] = response.items;

        return this._gcalStorageService.eventInstances$.next(
          <GcalEventInstances>newGcalEventInstances
        );
      });
  }



  /**
   * @note CLE stands for GcalCalendarListEntry
   * @note _all-day event_: only **date** properties, no **dateTime**
   * @see _fetchGcalCalendarList
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
  private _removeBirthdayCLEs(calendarList: GcalCalendarList): GcalCalendarList {
    return calendarList.filter(
      (calendarListEntry: GcalCalendarListEntry) =>
        !calendarListEntry.id.includes('#contacts')
    );
  }

  /**
   * @note removes all-day and cancelled events
   * @see _fetchGcalCalendarGcalEvents
   */
  private _removeInvalidGcalEvents(events: GcalEvent[]): GcalEvent[] {
    return events.filter((event: GcalEvent) => !this._isInvalidGcalEvent(event));
  }
  private _isInvalidGcalEvent(event: GcalEvent): boolean {
    return this._isCancelledGcalEvent(event) || !this._isTimedGcalEvent(event);
  }
  private _isCancelledGcalEvent(event: GcalEvent): boolean {
    return event.status === 'cancelled';
  }
  private _isTimedGcalEvent(event: GcalEvent): boolean {
    return 'dateTime' in event.start;
  }
}
