import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarList } from 'src/app/models/calendar-list.model';
import { EventList, EventListEntry, Event } from 'src/app/models/event.model';

enum TimeMinFlag {
  ONE_DAY_AGO,
  ONE_WEEK_AGO,
  ONE_MONTH_AGO,
}
enum TimeMaxFlag {
  ONE_DAY_FROM_TODAY,
  ONE_WEEK_FROM_TODAY,
  ONE_MONTH_FROM_TODAY,
}

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

  constructor() {}

  getCalendarList(): CalendarList {
    return this.calendarList$.getValue();
  }

  getCalendarEventList(
    calendarId: string,
    timeMin?: TimeMinFlag,
    timeMax?: TimeMaxFlag
  ): Array<Event> {
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
    return calendarEventListEntry[0][1];
  }

  getEventList(timeMin?: TimeMinFlag, timeMax?: TimeMaxFlag): EventList {
    let eventList = this.eventList$.getValue();
  }
}
