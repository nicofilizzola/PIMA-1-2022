import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ONE_DAY_AGO, ONE_MONTH_AGO, ONE_WEEK_AGO } from 'src/app/constants';
import {
  CalendarList,
  CalendarListEntry,
} from 'src/app/models/calendar-list.model';
import { Event, EventList } from 'src/app/models/event.model';
import { CalendarListListResponse } from 'src/app/models/gcal-response/calendar-list/calendar-list.list.model';
import { EventListResponse } from 'src/app/models/gcal-response/event/event.list.model';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

enum TimeMinFlag {
  ONE_DAY_AGO,
  ONE_WEEK_AGO,
  ONE_MONTH_AGO,
}

/**
 * @note Gcal stands for Google Calendar
 */
@Injectable({
  providedIn: 'root',
})
export class GcalService {
  /**
   * @note before using state values stored in BehaviorSubjects,
   * always verify that they differ from their initialization value.
   */
  calendarList$ = new BehaviorSubject<CalendarList>([]);
  eventList$ = new BehaviorSubject<EventList>(null);
  allCalendarsFetched$ = new Subject<boolean>();

  constructor(private _http: HttpClient) {}

  /**
   * @brief Runs the **CalendarList.list** method
   * @note Only passes on non all-day-inherent calendars
   */
  fetchCalendarList(): void {
    this._http
      .get(`${GOOGLE_CALENDAR_API}/users/me/calendarList`)
      .subscribe((response: CalendarListListResponse) => {
        let timedCalendarList: CalendarList = this._removeAllDayCLEs(
          response.items
        );
        return this.calendarList$.next(timedCalendarList);
      });
  }

  /**
   * @brief Runs the **Events.list** method
   * @note Only passes on timed events
   */
  fetchCalendarEvents(calendarId: string, timeMinFlag: TimeMinFlag) {
    const timeMin = this._getTimeMin(timeMinFlag);
    const today = new Date().toISOString();

    this._http
      .get(`${GOOGLE_CALENDAR_API}/calendars/${calendarId}/events`, {
        params: {
          timeMin: timeMin,
          timeMax: today,
          maxResults: 2500,
        },
      })
      .subscribe((response: EventListResponse) => {
        let timedEvents = this._removeAllDayEvents(response.items);
        let calendarEvents = <EventList>{ ...this.eventList$.getValue() };
        calendarEvents[calendarId] = timedEvents;
        return this.eventList$.next(calendarEvents);
      });
  }

  /**
   * @brief Runs **CalendarList.list** and **Events.list** for each calendarList
   * @note Once all the events are fetched, this.allEventsFetc
   */
  fetchAllCalendarEvents(timeMinFlag: TimeMinFlag) {
    this.fetchCalendarList();
    this.calendarList$.subscribe((calendarList: CalendarList) => {
      calendarList.forEach((calendarListEntry: CalendarListEntry) => {
        this.fetchCalendarEvents(calendarListEntry.id, timeMinFlag);
      });
    });
    this.eventList$.subscribe((eventList: EventList) => {
      if (eventList === null) {
        return
      }
      if (eventList.length < this.calendarList$.getValue().length) {
        return
      }
      return this.allCalendarsFetched$.next(true)
    })
  }

  /**
   * @note CLE stands for CalendarListEntry
   * @note _all-day event_: only **date** properties, no **dateTime**ù
   * @see fetchCalendarList
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

  private _removeAllDayEvents(events: Event[]): Event[] {
    return events.filter((event: Event) => 'dateTime' in event.start);
  }

  /**
   * @returns string containing ISO format date
   * @see fetchCalendarEvents
   */
  private _getTimeMin(timeMinFlag: TimeMinFlag): string {
    switch (timeMinFlag) {
      case ONE_DAY_AGO:
        return new Date(new Date().getDate() - 1).toISOString();
      case ONE_WEEK_AGO:
        return new Date(new Date().getDate() - 7).toISOString();
      case ONE_MONTH_AGO:
        return new Date(new Date().getDate() - 30).toISOString();
      default:
        console.error("timeMinFlag's value is not recognized");
    }
  }
}
