import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarList, CalendarListEntry } from 'src/app/models/calendar-list.model';
import { CalendarListListResponse } from 'src/app/models/gcal-response/calendar-list.list.model';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

/**
 * @note Gcal stands for Google Calendar
 */
@Injectable({
  providedIn: 'root',
})
export class GcalService {
  calendarList$ = new BehaviorSubject<CalendarList>([]);
  // eventLists$ = new BehaviorSubject<EventList[]>([]);
  // colors$ = new BehaviorSubject<Colors>(null);

  constructor(private _http: HttpClient) {}

  fetchCalendarList() {
    this._http.get(`${GOOGLE_CALENDAR_API}/users/me/calendarList`).subscribe({
      next: (response: CalendarListListResponse) => {
        let timedCalendarList: CalendarList = this._removeAllDayCLEs(response.items)
        return this.calendarList$.next(timedCalendarList);
      },
      error: (error: Error) => console.error(error)
    });
  }

  // fetchCalendarEventList(calendarId: string) {
  //   const oneYearAgo = new Date(new Date().getFullYear() - 1).toISOString();
  //   const oneWeekAgo = new Date(new Date().getDate() - 7).toISOString();
  //   const today = new Date().toISOString();

  //   this._http
  //     .get(`${GOOGLE_CALENDAR_API}/calendars/${calendarId}/events`, {
  //       params: {
  //         timeMin: oneWeekAgo,
  //         timeMax: today,
  //         maxResults: 2500,
  //       },
  //     })
  //     .subscribe({
  //       next: (response: CalendarResponse) => {
  //         let eventLists = this.eventLists$.getValue();
  //         let calendarIndex = this.calendarList$
  //           .getValue()
  //           .findIndex((calendar) => calendar.id === calendarId);

  //         eventLists[calendarIndex] = new EventList(calendarId, response.items);
  //         return this.eventLists$.next(eventLists);
  //       },
  //     });
  // }

  // fetchColors() {
  //   this._http
  //     .get(`${GOOGLE_CALENDAR_API}/colors`)
  //     .subscribe((colors: Colors) => {
  //       this.colors$.next(colors);
  //     });
  // }

  // /**
  //  * @returns the array of Events binded to a given calendarId.
  //  * @note the given Events must have already been fetched via the fetchCalendarEvents(calendarId) method
  //  * @todo put this method somewhere else
  //  */
  // getCalendarEventList(calendarId: string): Event[] {
  //   for (let eventList of this.eventLists$.getValue()) {
  //     if (eventList === undefined) {
  //       continue;
  //     }
  //     if (eventList.calendarId === calendarId) {
  //       return eventList.eventList;
  //     }
  //   }
  // }

  private _removeHolidayCLEs(calendarList: CalendarList): CalendarList {
    return calendarList.filter((calendarListEntry: CalendarListEntry) => !calendarListEntry.id.includes('#holiday'))
  }
  private _removeBirthdayCLEs(calendarList: CalendarList): CalendarList {
    return calendarList.filter((calendarListEntry: CalendarListEntry) => !calendarListEntry.id.includes('#contacts'))
  }
  private _removeAllDayCLEs(calendarList: CalendarList): CalendarList {
    let holidaylessCL = this._removeHolidayCLEs(calendarList)
    return this._removeBirthdayCLEs(holidaylessCL);
  }

  // private _isArrayUndefined(array: Array<any>): boolean {
  //   for (let element of array) {
  //     if (element != null) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }
}
