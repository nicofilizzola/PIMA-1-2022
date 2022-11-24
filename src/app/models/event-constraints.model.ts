import { AddEventItemComponent } from '../components/add-event-list/add-event-item/add-event-item.component';
import { GcalEvent } from './gcal/event.model';

/**
 * @brief Class containing the event constraints submitted by the user on the eadd-event-item
 */
export class EventConstraints {
  title: string;
  hourDuration: number;
  minuteDuration: number;
  priority: string;
  calendarId: string;

  // Advanced options
  location: string;
  instanceTotal: number;
  minDailyInstances: number;
  maxDailyInstances: number;
  lowerBound: string;
  upperBound: string;
  margin: number;
  date: string;
  time: string;
  description: string;
  fixedEvent = false;
  consecutiveInstances = false;

  constructor(aeiComponent: AddEventItemComponent) {
    this.title = aeiComponent.title;
    this.hourDuration = aeiComponent.hourDuration;
    this.minuteDuration = aeiComponent.minuteDuration;
    this.priority = aeiComponent.priority;
    this.calendarId = aeiComponent.calendar;
    if (aeiComponent.location != null) this.location = aeiComponent.location;
    if (aeiComponent.instanceTotal != null)
      this.instanceTotal = aeiComponent.instanceTotal;
    if (aeiComponent.minDailyInstances != null)
      this.minDailyInstances = aeiComponent.minDailyInstances;
    if (aeiComponent.maxDailyInstances != null)
      this.maxDailyInstances = aeiComponent.maxDailyInstances;
    if (aeiComponent.lowerBound != null)
      this.lowerBound = aeiComponent.lowerBound;
    if (aeiComponent.upperBound != null)
      this.upperBound = aeiComponent.upperBound;
    if (aeiComponent.margin != null) this.margin = aeiComponent.margin;
    if (aeiComponent.date != null) this.date = aeiComponent.date;
    if (aeiComponent.time != null) this.time = aeiComponent.time;
    if (aeiComponent.description != null)
      this.description = aeiComponent.description;
    if (aeiComponent.fixedEvent != null)
      this.fixedEvent = aeiComponent.fixedEvent;
    if (aeiComponent.consecutiveInstances != null)
      this.consecutiveInstances = aeiComponent.consecutiveInstances;
  }

  getStartDate(): Date {
    return new Date (this.date + "," + this.time + ":00")
  }

  getDurationMs(): number {
    let hourDurationMs = this.hourDuration * 3600000;
    let minDurationMs = this.minuteDuration * 60000;
    return hourDurationMs + minDurationMs;
  }

  toEvent(startTime: Date): GcalEvent {
    let eventCreated: GcalEvent;
    if (this.fixedEvent) {
      let startDate = this.getStartDate();
      let endDate = new Date(startDate.getTime() + this.getDurationMs());
      eventCreated = {
        start: { dateTime: startDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
      };
    } else {
      let endTime = new Date(startTime.getTime() + this.getDurationMs());
      eventCreated = {
        start: {
          dateTime: startTime.toISOString(),
        },
        end: {
          dateTime: endTime.toISOString(),
        },
      };
    }

    if (this.description != null) {
      eventCreated.description = this.description;
    }

    if (this.location != null) {
      eventCreated.location = this.location;
    }

    if (this.title != null) {
      eventCreated.summary = this.title;
    }
    console.log(eventCreated);
    return eventCreated;
  }
}
