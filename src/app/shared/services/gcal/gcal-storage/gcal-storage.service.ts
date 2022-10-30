import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ONE_DAY_AGO, ONE_MONTH_AGO, ONE_WEEK_AGO } from 'src/app/constants';
import { CalendarList } from 'src/app/models/calendar-list.model';
import { EventList, EventListEntry, Event } from 'src/app/models/event.model';

@Injectable({
  providedIn: 'root',
})
export class GcalStorageService {
  /**
   * @note before using state values stored in BehaviorSubjects,
   * always verify that they differ from their initialization value.
   */
  calendarList$ = new BehaviorSubject<CalendarList>(null);
  eventList$ = new BehaviorSubject<EventList>(null);
  dataFetched$ = new Subject<boolean>()

  constructor() {}

  getCalendarList(): CalendarList {
    return this.calendarList$.getValue();
  }

  /**
   * @note Gets all of the fetched events from the specified calendar in the desired time ranged (if specified)
   * @note Both time parameters `timestampMin` and `timestampMax` can use constants ONE_DAY_AGO, ONE_WEEK_AGO, ONE_MONTH_AGO,
   * TODAY, ONE_DAY_FROM_TODAY, ONE_WEEK_FROM_TODAY, ONE_MONTH_FROM_TODAY
   */
  getCalendarEventList(
    calendarId: string,
    timestampMin?: number,
    timestampMax?: number
  ): Event[] {
    let eventListEntries = Object.entries(this.eventList$.getValue());
    let calendarEventListEntry: EventListEntry[] = eventListEntries.filter(
      (eventListEntry: EventListEntry) => eventListEntry[0] === calendarId
    );

    if (calendarEventListEntry.length === 0) {
      console.error(
        "The provided calendarId does not match any of the user's calendar ids"
      );
      return;
    }

    let calendarEvents = calendarEventListEntry[0][1];
    let rangedEventList = this._getRangedEventList(
      calendarEvents,
      timestampMin,
      timestampMax
    );
    return rangedEventList;
  }

  /**
   * @note Gets all of the fetched events from all the calendars in the desired time ranged (if specified)
   * @note Both time parameters `timestampMin` and `timestampMax` can use constants ONE_DAY_AGO, ONE_WEEK_AGO, ONE_MONTH_AGO,
   * TODAY, ONE_DAY_FROM_TODAY, ONE_WEEK_FROM_TODAY, ONE_MONTH_FROM_TODAY
   */
  getEventList(timestampMin?: number, timestampMax?: number): EventList {
    let eventListEntries = Object.entries(this.eventList$.getValue());
    let rangedEventListEntries = eventListEntries.map(
      (eventListEntry: EventListEntry) => {
        return this._getRangedEventList(
          eventListEntry[1],
          timestampMin,
          timestampMax
        );
      }
    );
    let rangedEventList = Object.fromEntries(rangedEventListEntries);
    return rangedEventList;
  }

  private _getRangedEventList(
    calendarEvents: Event[],
    timestampMin?: number,
    timestampMax?: number
  ): Event[] {
    let filteredEvents = [...calendarEvents];

    if (timestampMin) {
      filteredEvents = calendarEvents.filter((event: Event) => {
        const eventStartTimestamp = new Date(event.start.dateTime).getTime();
        return timestampMin < eventStartTimestamp;
      });
    }
    if (timestampMax) {
      filteredEvents = calendarEvents.filter((event: Event) => {
        const eventEndTimestamp = new Date(event.end.dateTime).getTime();
        return timestampMax > eventEndTimestamp;
      });
    }

    return filteredEvents;
  }
}
