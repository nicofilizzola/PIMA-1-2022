import { GcalCalendarListEntry } from '../../calendar-list.model';

export interface GcalCalendarListListResponse {
  kind: 'calendar#calendarList';
  etag: string; // Type etag
  nextPageToken: string;
  nextSyncToken: string;
  items: GcalCalendarListEntry[];
}
