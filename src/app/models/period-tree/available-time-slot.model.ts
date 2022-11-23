import { Time } from '@angular/common';
import { GcalEvent } from '../event.model';
import { PeriodTree, Period } from './period-tree.model';
const dayInMillis = 24 * 60 * 60 * 1000;


export class AvailableTimeSlot {

  availableSlotsTree : PeriodTree;

  /**
   *
   * @param eventList : list of Event, the one of the calendar generator service
   * @param period : (Date,Date), the Date of Beginning, the Date of Ending
   * @param infTime : Start time of a day
   * @param supTime : End time for a day.
   */

  constructor(
    eventList: GcalEvent[],
    period: Period,
    infTime: Time,
    supTime: Time
  ) {
    this.availableSlotsTree = new PeriodTree(period);
    this.removeAllNights(period,infTime,supTime);
    this.removeAllEvents(eventList);
  }

  getListTimeSlots() {
    return this.availableSlotsTree.getListPeriod();
  }

  removeEvent(event : GcalEvent){
    let start = new Date (event.start.dateTime);
    let end = new Date (event.end.dateTime);
    this.availableSlotsTree.removePeriodDate(start,end);
  }

  private removeAllEvents(eventList:GcalEvent[]){
    for (let event of eventList){
      this.removeEvent(event);
    }
  }

  private removeAllNights(period: Period, infTime: Time, supTime: Time) {
    let nightStart = new Date();
    let nightEnd = new Date();

    let infTimeMillis =
      infTime.hours * 60 * 60 * 1000 + infTime.minutes * 60 * 1000;
    let supTimeMillis =
      supTime.hours * 60 * 60 * 1000 + supTime.minutes * 60 * 1000;
    let nightDurationInMillis = dayInMillis - supTimeMillis + infTimeMillis;

    let actualTimeOfDay = period.getStart().getTime() % dayInMillis;

    nightStart.setTime(
      period.getStart().getTime() + supTimeMillis - actualTimeOfDay - dayInMillis
    );

    while (nightStart < period.getEnd()) {
      nightEnd.setTime(nightStart.getTime() + nightDurationInMillis);
      this.availableSlotsTree.removePeriodDate(nightStart, nightEnd);
      nightStart.setTime(nightStart.getTime() + dayInMillis);
    }
  }
}
