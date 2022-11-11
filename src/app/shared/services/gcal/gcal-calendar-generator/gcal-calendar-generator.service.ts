import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarList } from 'src/app/models/calendar-list.model';
import { EventList } from 'src/app/models/event.model';
import { GcalHttpService } from '../gcal-http/gcal-http.service';
import { GcalStorageService } from '../gcal-storage/gcal-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GcalCalendarGeneratorService {

  calendarList$ = new BehaviorSubject<CalendarList>(null);
  eventList$ = new BehaviorSubject<EventList>(null);
  listEvent

  constructor(
    private _gcalStorageService: GcalStorageService,
    private _gcalHttpService: GcalHttpService
    ) { }

  setListEvent(listEvent){
    this.listEvent=listEvent;
  }

  generate(){

  }

  updateLocalStorage(){
    this._gcalHttpService.fetchData()

  }

}
