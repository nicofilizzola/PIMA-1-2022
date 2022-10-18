import { Injectable } from '@angular/core';
import { calendarListEvents } from 'src/fixtures/fixtures';
import { Event, EventList } from 'src/app/models/event.model';
import { GcalService } from '../gcal/gcal.service';
import { Calendar } from 'src/app/models/calendar.model';
import { CalendarListEntry } from 'src/app/models/calendar-list.model';

@Injectable({
  providedIn: 'root',
})
export class PercentageService {
  totalEventTime: number;

  constructor(private _gcalService: GcalService) {
    this._gcalService.eventList$.subscribe((eventList: EventList) => {
      if (this._gcalService.eventList$.getValue() != null) {
        let events = Object.entries(eventList).map(
          (eventListEntry: [string, Event[]]) => eventListEntry[1]
        ).flat();
        this._setTotalEventsTime(events);
      }
    });
  }

  /**
   * @returns The calendar's events time percentage in the total event time. The result is rounded to two decimals
   */
  public getCalendarPercentage(calendarId: string): number {
    if (
      this.totalEventTime == null ||
      this._gcalService.eventList$.getValue() == null
    ) {
      return 0;
    }

    let calendarEventsTotalTime = 0;
    let calendarEvents = this._gcalService.eventList$.getValue()[calendarId];

    for (let event of calendarEvents) {
      calendarEventsTotalTime += this._getEventDuration(event);
    }

    const ROUNDING_COEFFICIENT = 100;
    const longPercentage =
      (calendarEventsTotalTime / this.totalEventTime) * 100;
    const roundedPercentage =
      Math.round(longPercentage * ROUNDING_COEFFICIENT) / ROUNDING_COEFFICIENT;
    return roundedPercentage;
  }

  private _setTotalEventsTime(events: Event[]) {
    let totalTime = 0;

    for (let event of events) {
      totalTime += this._getEventDuration(event);
    }
    this.totalEventTime = totalTime;
  }

  /**
   * @returns The event's duration in seconds
   */
  private _getEventDuration(event: Event): number {
    const SECOND_IN_TIMESTAMP_FORMAT = 1000;
    let eventStartDate = new Date(event.start.dateTime);
    let eventEndDate = new Date(event.end.dateTime);
    return (
      (eventEndDate.getTime() - eventStartDate.getTime()) /
      SECOND_IN_TIMESTAMP_FORMAT
    );
  }
}
