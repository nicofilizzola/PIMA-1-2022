import { GcalEvent } from "../../gcal/event.model";

export interface GcalEventInstancesResponse {
  kind: 'calendar#events';
  etag: string; // type etag
  summary: string;
  description: string;
  updated: string; // RFC3339 timestamp
  timeZone: string;
  accessRole: string;
  defaultReminders: [
    {
      method: string;
      minutes: number; // type integer
    }
  ];
  nextPageToken: string;
  nextSyncToken: string;
  items: GcalEvent[];
}
