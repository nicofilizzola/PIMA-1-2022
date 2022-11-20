export interface GcalCalendar {
  kind: 'calendar#calendar';
  etag: string; // type etag
  id: string;
  summary: string;
  description: string;
  location: string;
  timeZone: string;
  conferenceProperties: {
    allowedConferenceSolutionTypes: string[];
  };
}
