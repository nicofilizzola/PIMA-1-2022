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
    if (aeiComponent.instanceTotal != null) this.instanceTotal = aeiComponent.instanceTotal;
    if (aeiComponent.minDailyInstances != null) this.minDailyInstances = aeiComponent.minDailyInstances;
    if (aeiComponent.maxDailyInstances != null) this.maxDailyInstances = aeiComponent.maxDailyInstances;
    if (aeiComponent.lowerBound != null) this.lowerBound = aeiComponent.lowerBound;
    if (aeiComponent.upperBound != null) this.upperBound = aeiComponent.upperBound;
    if (aeiComponent.margin != null) this.margin = aeiComponent.margin;
    if (aeiComponent.date != null) this.date = aeiComponent.date;
    if (aeiComponent.time != null) this.time = aeiComponent.time;
    if (aeiComponent.description != null) this.description = aeiComponent.description;
    if (aeiComponent.fixedEvent != null) this.fixedEvent = aeiComponent.fixedEvent;
    if (aeiComponent.consecutiveInstances != null)
      this.consecutiveInstances = aeiComponent.consecutiveInstances;
  }

  getDurationMs(): number {
    let hourDurationMs = this.hourDuration * 3600000;
    let minDurationMs = this.minuteDuration * 60000;
    return hourDurationMs + minDurationMs;
  }

  toEvent(startTime: Date): GcalEvent {
    let endTime = new Date(startTime.getTime() + this.getDurationMs());
    let event: GcalEvent = {
      start: {
        dateTime: startTime.toISOString(),
      },
      end: {
        dateTime: endTime.toISOString(),
      },
    };
    return event;
  }
}
