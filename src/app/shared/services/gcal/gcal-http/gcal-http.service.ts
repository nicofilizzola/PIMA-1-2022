import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Subject, Subscription } from 'rxjs';
import {
  CalendarList,
  CalendarListEntry,
} from 'src/app/models/calendar-list.model';
import {
  Event,
  EventInstances,
  EventList,
  EventListEntry,
} from 'src/app/models/event.model';
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
  private _eventInstancesSubscription: Subscription;
  /**
   * @note used for managing the `dataFetched$` stream
   */
  private _calendarsWithRecurringEvents = [];

  constructor(
    private _http: HttpClient,
    private _gcalStorageService: GcalStorageService
  ) {}

  fetchData() {
    this._fetchCalendarList();
    this._handleEventListFetch();
    this._handleEventInstancesFetch();
    this._handleDataFetchedStream();
  }

  /**
   * @see this.fetchData
   */
  private _handleEventListFetch() {
    this._gcalStorageService.calendarList$.subscribe(
      (calendarList: CalendarList) => {
        if (calendarList === null) return; // skip init value

        calendarList.forEach((calendarListEntry: CalendarListEntry) => {
          this._fetchCalendarEvents(calendarListEntry.id);
        });
      }
    );
  }

  /**
   * @see this.fetchData
   */
  private _handleEventInstancesFetch() {
    let subscription = this._gcalStorageService.eventList$.subscribe(
      (eventList: EventList) => {
        if (eventList === null) return; // skip init value

        Object.entries(eventList).forEach((eventListEntry: EventListEntry) => {
          let calendarId = eventListEntry[0];
          let events = eventListEntry[1];
          events.forEach((event: Event) => {
            if ('recurringEventId' in event) {
              if (!this._calendarsWithRecurringEvents.includes(calendarId)) {
                this._calendarsWithRecurringEvents.push(calendarId);
              }

              this._fetchRecurringEventInstances(
                calendarId,
                event.recurringEventId
              );
            }
          });
        });
      }
    );

    setTimeout(() => {
      subscription.unsubscribe();
    }, 5000);
  }

  /**
   * @brief Updates the dataFetched$ stream only after all events are fetched from all calendars
   * @note Currently only subscribes to `eventInstances$` since it's the last one of the sequence,
   * meaning that in order for `eventInstances` to be done `eventList` and calendarList must also be.
   * @see this.fetchData
   */
  private _handleDataFetchedStream() {
    this._eventInstancesSubscription =
      this._gcalStorageService.eventInstances$.subscribe(
        (eventInstances: EventInstances) => {
          if (eventInstances == null) return; // skip init value

          if (
            Object.entries(eventInstances).length <
            this._calendarsWithRecurringEvents.length
          ) {
            return;
          }
          return this._gcalStorageService.dataFetched$.next(true);
        }
      );

    this._gcalStorageService.dataFetched$.pipe(first()).subscribe(() => {
      // first() unsubscribes after first observation
      this._eventInstancesSubscription.unsubscribe();
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
      .pipe(first())
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
  _fetchRecurringEventInstances(calendarId: string, recurringEventId: string) {
    this._http
      .get(
        `${GOOGLE_CALENDAR_API}/calendars/${calendarId}/events/${recurringEventId}/instances`
      )
      .pipe(first())
      .subscribe((response: EventInstancesResponse) => {
        let currentEventInstances =
          this._gcalStorageService.eventInstances$.getValue();
        let newEventInstances = {};

        if (currentEventInstances != null) {
          newEventInstances = <EventInstances>{ ...currentEventInstances };
        }

        newEventInstances[calendarId] = {};
        newEventInstances[calendarId][recurringEventId] = response.items;

        return this._gcalStorageService.eventInstances$.next(
          <EventInstances>newEventInstances
        );
      });
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
    return events.filter((event: Event) => !this._isInvalidEvent(event));
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
