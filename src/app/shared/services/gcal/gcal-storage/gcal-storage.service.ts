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

  getGcalCalendarList(): GcalCalendarList {
    return this.calendarList$.getValue();
  }

  /**
   * @note Gets all of the fetched events from the specified calendar in the desired time ranged (if specified)
   * @note Both time parameters `timestampMin` and `timestampMax` can use constants ONE_DAY_AGO, ONE_WEEK_AGO, ONE_MONTH_AGO,
   * TODAY, ONE_DAY_FROM_TODAY, ONE_WEEK_FROM_TODAY, ONE_MONTH_FROM_TODAY
   */
  getGcalCalendarGcalEventList(
    calendarId: string,
    timestampMin?: number,
    timestampMax?: number
  ): GcalEvent[] {
    let eventListEntries = Object.entries(this.eventList$.getValue());
    let calendarGcalEventListEntry: GcalEventListEntry[] = eventListEntries.filter(
      (eventListEntry: GcalEventListEntry) => eventListEntry[0] === calendarId
    );

    if (calendarGcalEventListEntry.length === 0) {
      return [];
    }

    let calendarGcalEvents = calendarGcalEventListEntry[0][1];
    let rangedGcalEventList = this._getRangedGcalEventList(
      calendarGcalEvents,
      timestampMin,
      timestampMax
    );
    return rangedGcalEventList;
  }

  /**
   * @note Gets all of the fetched events from all the calendars in the desired time ranged (if specified)
   * @note Both time parameters `timestampMin` and `timestampMax` can use constants ONE_DAY_AGO, ONE_WEEK_AGO, ONE_MONTH_AGO,
   * TODAY, ONE_DAY_FROM_TODAY, ONE_WEEK_FROM_TODAY, ONE_MONTH_FROM_TODAY
   */
  getGcalEventList(timestampMin?: number, timestampMax?: number): GcalEventList {
    let eventListEntries = Object.entries(this.eventList$.getValue());
    let rangedGcalEventListEntries = eventListEntries.map(
      (eventListEntry: GcalEventListEntry) => {
        return [
          eventListEntry[0],
          this._getRangedGcalEventList(
            eventListEntry[1],
            timestampMin,
            timestampMax
          ),
        ];
      }
    );
    let rangedGcalEventList: GcalEventList = Object.fromEntries(rangedGcalEventListEntries);
    return rangedGcalEventList;
  }

  getGcalCalendarGcalEventInstances(
    calendarId: string,
    timestampMin?: number,
    timestampMax?: number
  ): GcalEvent[] {
    let eventInstances = this.eventInstances$.getValue();
    let returnGcalEventInstances = [];

    if (calendarId in eventInstances === false) {
      return [];
    }
    for (let calendarId in eventInstances) {
      for (let eventId in eventInstances[calendarId]) {
        returnGcalEventInstances.push(eventInstances[calendarId][eventId]);
      }
    }

    returnGcalEventInstances = returnGcalEventInstances.flat();

    return this._getRangedGcalEventList(
      returnGcalEventInstances,
      timestampMin,
      timestampMax
    );
  }

  /**
   * @note Gets all of the fetched event instances from all the calendars in the desired time ranged (if specified)
   * @note Both time parameters `timestampMin` and `timestampMax` can use constants ONE_DAY_AGO, ONE_WEEK_AGO, ONE_MONTH_AGO,
   * TODAY, ONE_DAY_FROM_TODAY, ONE_WEEK_FROM_TODAY, ONE_MONTH_FROM_TODAY
   */
  getGcalEventInstances(timestampMin?: number, timestampMax?: number): GcalEventList {
    let eventListEntries = Object.entries(this.eventInstances$.getValue());
    let rangedGcalEventListEntries = eventListEntries.map(
      (eventListEntry: GcalEventListEntry) => {
        return [
          eventListEntry[0],
          this._getRangedGcalEventList(
            eventListEntry[1],
            timestampMin,
            timestampMax
          ),
        ];
      }
    );
    let rangedGcalEventList: GcalEventList = Object.fromEntries(rangedGcalEventListEntries);
    return rangedGcalEventList;
  }

  /**
   * @returns a list with the calendar's events as well as its event instances
   * @note Both time parameters `timestampMin` and `timestampMax` can use constants ONE_DAY_AGO, ONE_WEEK_AGO, ONE_MONTH_AGO,
   * TODAY, ONE_DAY_FROM_TODAY, ONE_WEEK_FROM_TODAY, ONE_MONTH_FROM_TODAY
   */
  getAllGcalCalendarGcalEvents(
    calendarId: string,
    timestampMin?: number,
    timestampMax?: number
  ) {
    return [
      ...this.getGcalCalendarGcalEventList(calendarId, timestampMax, timestampMin),
      ...this.getGcalCalendarGcalEventInstances(calendarId, timestampMin, timestampMax),
    ];
  }

  /**
   * @returns The complete calendar eventList including recurring events
   */
  getAllGcalEventList(timestampMin?: number, timestampMax?: number): GcalEventList {
    let events = {};

    this.getGcalCalendarList().forEach((calendar: GcalCalendarListEntry) => {
      events[calendar.id] = this.getAllGcalCalendarGcalEvents(
        calendar.id,
        timestampMin,
        timestampMax
      );
    });

    return <GcalEventList>events;
  }

  getGcalCalendarSummary(calendarId): string {
    let calendar = this.getGcalCalendarList().find(
      (calendarListEntry: GcalCalendarListEntry) =>
        calendarListEntry.id === calendarId
    );

    if (calendar.id === this._gapiService.getAuthenticatedUserEmail()) {
      return DEFAULT_CALENDAR_SUMMARY;
    }
    return calendar.summary;
  }

  private _getRangedGcalEventList(
    calendarGcalEvents: GcalEvent[],
    timestampMin?: number,
    timestampMax?: number
  ): GcalEvent[] {
    let filteredGcalEvents = [...calendarGcalEvents];

    if (timestampMin) {
      filteredGcalEvents = calendarGcalEvents.filter((event: GcalEvent) => {
        const eventStartTimestamp = new Date(event.start.dateTime).getTime();
        return timestampMin < eventStartTimestamp;
      });
    }
    if (timestampMax) {
      filteredGcalEvents = calendarGcalEvents.filter((event: GcalEvent) => {
        const eventEndTimestamp = new Date(event.end.dateTime).getTime();
        return timestampMax > eventEndTimestamp;
      });
    }

    return filteredGcalEvents;
  }
}
