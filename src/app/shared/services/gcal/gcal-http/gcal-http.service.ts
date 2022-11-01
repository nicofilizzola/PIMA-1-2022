import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Subscription } from 'rxjs';
import { ONE_DAY_AGO, ONE_MONTH_AGO, ONE_WEEK_AGO } from 'src/app/constants';
import {
  CalendarList,
  CalendarListEntry,
} from 'src/app/models/calendar-list.model';
import { Event, EventList } from 'src/app/models/event.model';
import { CalendarListListResponse } from 'src/app/models/gcal-response/calendar-list/calendar-list.list.model';
import { EventListResponse } from 'src/app/models/gcal-response/event/event.list.model';
import { EventInstancesResponse } from 'src/app/models/gcal-response/event/event.list.model copy';
import { GcalStorageService } from '../gcal-storage/gcal-storage.service';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

/**
 * @note Gcal stands for Google Calendar
 */
@Injectable({
  providedIn: 'root',
})
export class GcalHttpService {
  calendarListSubscription: Subscription;
  eventListSubscription: Subscription;
  dataFetchedSubscription: Subscription;

  constructor(
    private _http: HttpClient,
    private _gcalStorageService: GcalStorageService
  ) {}

  fetchData() {
    this._fetchCalendarList();

    this.calendarListSubscription =
      this._gcalStorageService.calendarList$.subscribe(
        (calendarList: CalendarList) => {
          if (this._gcalStorageService.calendarList$.getValue() === null)
            return; // skip init value

          calendarList.forEach((calendarListEntry: CalendarListEntry) => {
            this._fetchCalendarEvents(calendarListEntry.id);
          });
        }
      );

    this._handleDataFetchedStream();
  }

  /**
   * @brief Updates the dataFetched$ stream only after all events are fetched from all calendars
   * @see this.fetchData()
   */
  private _handleDataFetchedStream() {
    this.eventListSubscription = this._gcalStorageService.eventList$.subscribe(
      (eventList: EventList) => {
        if (eventList === null) return; // skip init value
        if (
          Object.entries(eventList).length <
          this._gcalStorageService.calendarList$.getValue().length
        ) {
          return;
        }

        return this._gcalStorageService.dataFetched$.next(true);
      }
    );

    this._gcalStorageService.dataFetched$.pipe(first()).subscribe(() => {
      // first() unsubscribes after first observation
      this.calendarListSubscription.unsubscribe();
      this.eventListSubscription.unsubscribe();
    });
  }

  /**
   * @brief Runs the **CalendarList.list** method
   * @note Only passes on non all-day-inherent calendars
   */
  private _fetchCalendarList(): void {
    this._http
      .get(`${GOOGLE_CALENDAR_API}/users/me/calendarList`)
      .subscribe((response: CalendarListListResponse) => {
        let timedCalendarList: CalendarList = this._removeAllDayCLEs(
          response.items
        );
        return this._gcalStorageService.calendarList$.next(timedCalendarList);
      });
  }

  /**
   * @brief Runs the **Events.list** method
   * @note Only passes on timed events from one year ago to one year from today
   */
  _fetchCalendarEvents(calendarId: string) {
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
      .subscribe((response: EventListResponse) => {
        let calendarEvents = <EventList>{
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
    this._http.get(
      `${GOOGLE_CALENDAR_API}/calendars/${calendarId}/events/${recurringEventId}/instances`
    ).subscribe((response: EventInstancesResponse) => {
      if (this._gcalStorageService.eventInstances$.getValue() !== null) {
        this._gcalStorageService.eventInstances$.next(response.items)
      }
    })
  }

  /**
   * @note CLE stands for CalendarListEntry
   * @note _all-day event_: only **date** properties, no **dateTime**
   * @see _fetchCalendarList
   */
  private _removeAllDayCLEs(calendarList: CalendarList): CalendarList {
    let holidaylessCL = this._removeHolidayCLEs(calendarList);
    return this._removeBirthdayCLEs(holidaylessCL);
  }
  private _removeHolidayCLEs(calendarList: CalendarList): CalendarList {
    return calendarList.filter(
      (calendarListEntry: CalendarListEntry) =>
        !calendarListEntry.id.includes('#holiday')
    );
  }
  private _removeBirthdayCLEs(calendarList: CalendarList): CalendarList {
    return calendarList.filter(
      (calendarListEntry: CalendarListEntry) =>
        !calendarListEntry.id.includes('#contacts')
    );
  }

  /**
   * @note removes all-day and cancelled events
   * @see _fetchCalendarEvents
   */
  private _removeInvalidEvents(events: Event[]): Event[] {
    return events.filter((event: Event) => {
      if ('recurrence' in event) {
        console.log(event);
      }
      !this._isInvalidEvent(event);
    });
  }
  private _isInvalidEvent(event: Event): boolean {
    return this._isCancelledEvent(event) || !this._isTimedEvent(event);
  }
  private _isCancelledEvent(event: Event): boolean {
    return event.status === 'cancelled';
  }
  private _isTimedEvent(event: Event): boolean {
    return 'dateTime' in event.start;
  }
}
