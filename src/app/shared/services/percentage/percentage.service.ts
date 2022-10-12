import { Injectable } from '@angular/core';
import { calendarListEvents } from 'src/fixtures/fixtures';
import { Event } from '../../../models.old/event.model';

@Injectable({
  providedIn: 'root',
})
export class PercentageService {
  totalTime: number;
  calendarList;

  constructor() {
    this.calendarList = Object.entries(calendarListEvents).map(
      (calendar: Array<any>) => calendar[1]
    );
    this._setTotalTime(this.calendarList);
  }

  public getCalendarPercentage(eventList: Event[]) {
    let calendarTotal = 0;
    for (let event of eventList) {
      if (
        event === undefined ||
        'dateTime' in event.start === false ||
        'dateTime' in event.end === false
      ) {
        continue;
      }
      let eventDuration = this._getDuration(
        event.start.dateTime,
        event.end.dateTime
      );
      calendarTotal += eventDuration;
    }
    return (calendarTotal / this.totalTime) * 100;
  }

  private _setTotalTime(calendarList) {
    let totalTimeAcc = 0;

    for (let calendar of calendarList) {
      this._getEventsTotalTime(calendar)
    }
    this.totalTime = totalTimeAcc;
  }

  private _getEventsTotalTime(calendar) {
    let timeAccumulator = 0;

    for (let event of calendar.items) {
      if (
        event === undefined ||
        'dateTime' in event.start === false ||
        'dateTime' in event.end === false
      ) {
        continue;
      }
      let eventDuration = this._getDuration(
        event.start.dateTime,
        event.end.dateTime
      );
      timeAccumulator += eventDuration;
    }

    return timeAccumulator
  }

  private _getDuration(startDateTime, endDateTime) {
    var eventDateStart = new Date(startDateTime);
    var eventDateEnd = new Date(endDateTime);
    var eventDuration =
      (eventDateEnd.getTime() - eventDateStart.getTime()) / 60000;
    return eventDuration;
  }
}
