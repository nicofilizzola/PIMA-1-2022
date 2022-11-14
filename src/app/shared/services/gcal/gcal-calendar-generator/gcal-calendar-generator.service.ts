import { Time } from '@angular/common';
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
  /**
   * event : classic gcal event
   * 
   * bindEvent : {
   *  calendarId : String
   *  event : Event
   * }
   * 
   */

  calendarList : CalendarList;
  eventList : EventList;
  //{calendarId : [events]}
  listNewEvent;
  startTime : Time;
  endTime : Time;

  constructor(
    private _gcalStorageService: GcalStorageService,
    private _gcalHttpService: GcalHttpService
    ) { }

  setListEvent(listEvent){
    this.listNewEvent=listEvent;
  }

  setTimeStamp(start : Time,end : Time){
    this.startTime = start;
    this.endTime = end
  }

  updateLocalData(){
    this.calendarList = this._gcalStorageService.getCalendarList();
    this.eventList = this._gcalStorageService.getEventList();
  }

  generate(){
    this.updateLocalData();
    var calendarList = this._gcalStorageService.getCalendarList();
    for (var calendarId in calendarList){
      var events = this.listNewEvent[calendarId]
      for (var event in events){
        this.dumbInsert(calendarId,event)
      }
    }
  }

  //TODO
  //On le met dans l'api, puis dans le local storage, puis ici. 
  //A la fin on rappelle l'api pour mettre a jour le calendrier local. 
  dumbInsert(calendarId,event){
    if(event.start != null){

    }
    else {
      this._gcalHttpService.insertEvent(event,calendarId);
    }
  }

}
