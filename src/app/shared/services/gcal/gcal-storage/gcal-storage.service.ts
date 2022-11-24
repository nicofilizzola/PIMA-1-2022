import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DEFAULT_CALENDAR_SUMMARY } from 'src/app/constants';
import {
  GcalCalendarList,
  GcalCalendarListEntry,
} from 'src/app/models/calendar-list.model';
import {
  GcalEventList,
  GcalEventListEntry,
  GcalEvent,
  GcalEventInstances,
} from 'src/app/models/event.model';
import { GapiService } from '../../gapi/gapi.service';
import { AvailableTimeSlot } from 'src/app/models/period-tree/available-time-slot.model';
import { Period } from 'src/app/models/period-tree/period-tree.model';

@Injectable({
  providedIn: 'root',
})
export class GcalStorageService {
  /**
   * @note before using state values stored in BehaviorSubjects,
   * always verify that they differ from their initialization value.
   * This variables must be used ONLY from http
   */
  calendarList$ = new BehaviorSubject<GcalCalendarList>(null);
  eventList$ = new BehaviorSubject<GcalEventList>(null);
  eventInstances$ = new BehaviorSubject<GcalEventInstances>(null);
  /**
   * Used to signal to the whole application when the data fetch is completed
   * so the data access can be performed. Subscribe to this observable if you ever
   * want to use the `GcalStorageService` getters
   */
  dataFetched$ = new Subject<boolean>();

  constructor(private readonly _gapiService: GapiService) {}

  getCalendarList(): GcalCalendarList {
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
  ): GcalEvent[] {
    let eventListEntries = Object.entries(this.eventList$.getValue());
    let calendarEventListEntry: GcalEventListEntry[] = eventListEntries.filter(
      (eventListEntry: GcalEventListEntry) => eventListEntry[0] === calendarId
    );

    if (calendarEventListEntry.length === 0) {
      return [];
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
  getEventList(timestampMin?: number, timestampMax?: number): GcalEventList {
    let eventListEntries = Object.entries(this.eventList$.getValue());
    let rangedEventListEntries = eventListEntries.map(
      (eventListEntry: GcalEventListEntry) => {
        return [
          eventListEntry[0],
          this._getRangedEventList(
            eventListEntry[1],
            timestampMin,
            timestampMax
          ),
        ];
      }
    );
    let rangedEventList: GcalEventList = Object.fromEntries(
      rangedEventListEntries
    );
    return rangedEventList;
  }

  getCalendarEventInstances(
    calendarId: string,
    timestampMin?: number,
    timestampMax?: number
  ): GcalEvent[] {
    let eventInstances = this.eventInstances$.getValue();
    let returnEventInstances = [];

    if (calendarId in eventInstances === false) {
      return [];
    }
    for (let calendarId in eventInstances) {
      for (let eventId in eventInstances[calendarId]) {
        returnEventInstances.push(eventInstances[calendarId][eventId]);
      }
    }

    returnEventInstances = returnEventInstances.flat();

    return this._getRangedEventList(
      returnEventInstances,
      timestampMin,
      timestampMax
    );
  }

  /**
   * @note Gets all of the fetched event instances from all the calendars in the desired time ranged (if specified)
   * @note Both time parameters `timestampMin` and `timestampMax` can use constants ONE_DAY_AGO, ONE_WEEK_AGO, ONE_MONTH_AGO,
   * TODAY, ONE_DAY_FROM_TODAY, ONE_WEEK_FROM_TODAY, ONE_MONTH_FROM_TODAY
   */
  getEventInstances(
    timestampMin?: number,
    timestampMax?: number
  ): GcalEventList {
    let eventListEntries = Object.entries(this.eventInstances$.getValue());
    let rangedEventListEntries = eventListEntries.map(
      (eventListEntry: GcalEventListEntry) => {
        return [
          eventListEntry[0],
          this._getRangedEventList(
            eventListEntry[1],
            timestampMin,
            timestampMax
          ),
        ];
      }
    );
    let rangedEventList: GcalEventList = Object.fromEntries(
      rangedEventListEntries
    );
    return rangedEventList;
  }

  /**
   * @returns a list with the calendar's events as well as its event instances
   * @note Both time parameters `timestampMin` and `timestampMax` can use constants ONE_DAY_AGO, ONE_WEEK_AGO, ONE_MONTH_AGO,
   * TODAY, ONE_DAY_FROM_TODAY, ONE_WEEK_FROM_TODAY, ONE_MONTH_FROM_TODAY
   */
  getAllCalendarEvents(
    calendarId: string,
    timestampMin?: number,
    timestampMax?: number
  ) {
    return [
      ...this.getCalendarEventList(calendarId, timestampMax, timestampMin),
      ...this.getCalendarEventInstances(calendarId, timestampMin, timestampMax),
    ];
  }

  /**
   * @returns The complete calendar eventList including recurring events
   */
  getAllEventList(timestampMin?: number, timestampMax?: number): GcalEventList {
    let events = {};

    this.getCalendarList().forEach((calendar: GcalCalendarListEntry) => {
      events[calendar.id] = this.getAllCalendarEvents(
        calendar.id,
        timestampMin,
        timestampMax
      );
    });

    return <GcalEventList>events;
  }

  getCalendarSummary(calendarId): string {
    let calendar = this.getCalendarList().find(
      (calendarListEntry: GcalCalendarListEntry) =>
        calendarListEntry.id === calendarId
    );

    if (calendar.id === this._gapiService.getAuthenticatedUserEmail()) {
      return DEFAULT_CALENDAR_SUMMARY;
    }
    return calendar.summary;
  }

  private _getRangedEventList(
    calendarEvents: GcalEvent[],
    timestampMin?: number,
    timestampMax?: number
  ): GcalEvent[] {
    let filteredEvents = [...calendarEvents];

    if (timestampMin) {
      filteredEvents = calendarEvents.filter((event: GcalEvent) => {
        const eventStartTimestamp = new Date(event.start.dateTime).getTime();
        return timestampMin < eventStartTimestamp;
      });
    }
    if (timestampMax) {
      filteredEvents = calendarEvents.filter((event: GcalEvent) => {
        const eventEndTimestamp = new Date(event.end.dateTime).getTime();
        return timestampMax > eventEndTimestamp;
      });
    }

    return filteredEvents;
  }
}
