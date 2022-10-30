import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarList } from 'src/app/models/calendar-list.model';
import { EventList } from 'src/app/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class GcalStorageService {
  /**
   * @note before using state values stored in BehaviorSubjects,
   * always verify that they differ from their initialization value.
   */
   calendarList$ = new BehaviorSubject<CalendarList>(null);
   eventList$ = new BehaviorSubject<EventList>(null);

  constructor() { }
}
