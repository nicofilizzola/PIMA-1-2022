import { Time } from '@angular/common';
import { GcalEvent } from '../gcal/event.model';
import { PeriodTree, Period } from './period-tree.model';
const dayInMillis = 24 * 60 * 60 * 1000;

export class AvailableTimeSlot {
  availableSlotsTree: PeriodTree;

  /**
   *
   * @param eventList : list of Event, the one of the calendar generator service
   * @param period : (Date,Date), the Date of Beginning, the Date of Ending
   * @param infBound : Start time of a day
   * @param supBound : End time for a day.
   */

  constructor(
    eventList: GcalEvent[],
    period: Period,
    infBound: Time,
    supBound: Time
  ) {
    this.availableSlotsTree = new PeriodTree(period);
    this.removeAllOffBounds(period, infBound, supBound);
    this.removeAllEvents(eventList);
  }

  getListTimeSlots() {
    return this.availableSlotsTree.getListPeriod();
  }

  removeEvent(event: GcalEvent) {
    let start = new Date(event.start.dateTime);
    let end = new Date(event.end.dateTime);
    this.availableSlotsTree.removePeriodDate(start, end);
  }

  private removeAllEvents(eventList: GcalEvent[]) {
    for (let event of eventList) {
      this.removeEvent(event);
    }
  }

  private removeAllOffBounds(period: Period, infBound: Time, supBound: Time) {
    let offBoundStart = new Date();
    let offBoundEnd = new Date();

    let infBoundMillis =
      infBound.hours * 60 * 60 * 1000 + infBound.minutes * 60 * 1000;
    let supBoundMillis =
      supBound.hours * 60 * 60 * 1000 + supBound.minutes * 60 * 1000;
    let offBoundDurationInMillis =
      dayInMillis - supBoundMillis + infBoundMillis;

    let timeOfTheDay = period.getStart().getTime() % dayInMillis;

    offBoundStart.setTime(
      period.getStart().getTime() + supBoundMillis - timeOfTheDay - 4*dayInMillis
    );

    while (offBoundStart < period.getEnd()) {
      offBoundEnd.setTime(offBoundStart.getTime() + offBoundDurationInMillis);
      this.availableSlotsTree.removePeriodDate(offBoundStart, offBoundEnd);
      offBoundStart.setTime(offBoundStart.getTime() + dayInMillis);
    }
  }
}
