import { CalendarListEntry } from '../../calendar-list.model';

export interface CalendarListListResponse {
  kind: 'calendar#calendarList';
  etag: string; // Type etag
  nextPageToken: string;
  nextSyncToken: string;
  items: CalendarListEntry[];
}
