/**
 * @brief Class containing the event constraints submitted by the user on the eadd-event-item
 */
class EventConstraints {
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

  constructor(
    title: string,
    hourDuration: number,
    minuteDuration: number,
    priority: string,
    calendarId: string,
    location?: string,
    instanceTotal?: number,
    minDailyInstances?: number,
    maxDailyInstances?: number,
    lowerBound?: string,
    upperBound?: string,
    margin?: number,
    date?: string,
    time?: string,
    description?: string,
    fixedEvent?: boolean,
    consecutiveInstances?: boolean
  ) {
    this.title = title;
    this.hourDuration = hourDuration;
    this.minuteDuration = minuteDuration;
    this.priority = priority;
    this.calendarId = calendarId;
    if (location != null) this.location = location;
    if (instanceTotal != null) this.instanceTotal = instanceTotal;
    if (minDailyInstances != null) this.minDailyInstances = minDailyInstances;
    if (maxDailyInstances != null) this.maxDailyInstances = maxDailyInstances;
    if (lowerBound != null) this.lowerBound = lowerBound;
    if (upperBound != null) this.upperBound = upperBound;
    if (margin != null) this.margin = margin;
    if (date != null) this.date = date;
    if (time != null) this.time = time;
    if (description != null) this.description = description;
    if (fixedEvent != null) this.fixedEvent = fixedEvent;
    if (consecutiveInstances != null)
      this.consecutiveInstances = consecutiveInstances;
  }

  get durationMs(): number {
    let hourDurationMs = this.hourDuration * 3600000;
    let minDurationMs = this.minuteDuration * 60000;
    return hourDurationMs + minDurationMs;
  }
}
