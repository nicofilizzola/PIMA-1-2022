export interface Event {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime: string; // Only if not "whole day" event
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurrence?: string[];
  
  iCalUID: string;
  sequence: number;

  reminders: {
    useDefault: boolean;
  };
  eventType: string;
}

export class EventList {
  constructor(calendarId: string, eventList: Event[]){
    this.calendarId = calendarId
    this.eventList = eventList
  }

  calendarId: string
  eventList: Event[]
}
