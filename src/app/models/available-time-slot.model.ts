import { Time } from '@angular/common';
import { EmptyExpr } from '@angular/compiler';
import { EmptyError } from 'rxjs';
import { GcalEvent, GcalEventList } from './event.model';
import { NodeM, Period } from './nodeM.model';
const dayInMillis = 24 * 60 * 60 * 1000;


export class AvailableTimeSlot {

  availableSlotsTree : NodeM;

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
    this.availableSlotsTree = new NodeM(period);
    this.removeAllNights(period,infTime,supTime);
    this.removeAllEvents(eventList);
  }

  getListTimeSlots() {
    return this.availableSlotsTree.getListPeriod();
  }

  removeEvent(event : GcalEvent){
    let start = new Date (event.start.date);
    let end = new Date (event.end.date);
    this.availableSlotsTree.removePeriodDate(start,end);
  }

  removeAllEvents(eventList:GcalEvent[]){
    for (let event of eventList){
      let start = event.start.date;
      let end = event.end.date;
      this.availableSlotsTree.removePeriodDate(new Date(start),new Date (end));
    }
  }

  removeAllNights(period: Period, infTime: Time, supTime: Time) {
    let nightStart = new Date();
    let nightEnd = new Date();

    //Usefull Stuff
    let infTimeMillis =
      infTime.hours * 60 * 60 * 1000 + infTime.minutes * 60 * 1000;
    let supTimeMillis =
      supTime.hours * 60 * 60 * 1000 + supTime.minutes * 60 * 1000;
    let nightDurationInMillis = dayInMillis - supTimeMillis + infTimeMillis;

    //Initialising nightStart to the Date of the first night start in the period.
    let actualTimeOfDay = period[0].getTime() % dayInMillis; //Give the time in millisecond of the day ex : if period start at 14h30, it will give 14 * 60 * 60 * 1000 + 30 * 60 * 1000
    if (actualTimeOfDay < infTimeMillis) {
      nightStart.setTime(
        period.getStart().getTime() + supTimeMillis - actualTimeOfDay - dayInMillis
      ); //Starts a day before
    } else if (actualTimeOfDay < supTimeMillis) {
      nightStart.setTime(period[0].getTime() + supTimeMillis - actualTimeOfDay);
    } else {
      nightStart.setTime(
        period.getStart().getTime() + supTimeMillis - actualTimeOfDay - dayInMillis
      ); //Starts a day before
    }

    //Loop on all the possible nights.
    while (nightStart.getTime() < period.getEnd().getTime()) {
      //Setting the night end
      nightEnd.setTime(nightStart.getTime() + nightDurationInMillis);
      //Update free periods
      this.availableSlotsTree.removePeriodDate(nightStart, nightEnd);
      //Preparing the next loop
      nightStart.setTime(nightStart.getTime() + dayInMillis); // Next Day
    }
  }
}
