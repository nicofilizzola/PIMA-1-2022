import { Component, OnInit } from '@angular/core';
import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { calendarListEvents } from 'src/fixtures/fixtures';
import rrulePlugin from '@fullcalendar/rrule'
import { start } from '@popperjs/core';
import { GcalService } from '../shared/services/gcal/gcal.service';
import { CalendarList, CalendarListEntry } from '../models/calendar-list.model'
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ONE_DAY_AGO, ONE_MONTH_AGO, ONE_WEEK_AGO } from 'src/app/constants';
import { Event, EventList } from 'src/app/models/event.model';
import { CalendarListListResponse } from 'src/app/models/gcal-response/calendar-list/calendar-list.list.model';
import { EventListResponse } from 'src/app/models/gcal-response/event/event.list.model';

// make the <full-calendar> element globally available by calling this function at the top-level
defineFullCalendarElement();

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  
    
    calendarOptions: CalendarOptions = {
    plugins: [ timeGridPlugin, dayGridPlugin, rrulePlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'timeGridWeek',    
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [
      { // this object will be "parsed" into an Event Object
        title: 'The Title', // a property!
        start: '2022-10-20T13:30:00+02:00', // a property!
        end: '2022-10-20T15:00:00+02:00', // a property! ** see important note below about 'end' **
        color: '#378006',
      }
    ],
  };


  constructor(private gcal : GcalService) { }

  ngOnInit(): void {

    this.setupEvents();
  }

  getTimeString(str) {
    return str.substring(str.indexOf("T") + 1);
  }

  getRecurr(str) {
    
    var recurringDays = [];

    var split_string = str.split(/;|:/);
    
    var type_recurr= split_string.find(x=> x.substring(0,5) == "FREQ=");

    if (type_recurr == "FREQ=DAILY") {
      recurringDays = [1,2,3,4,5,6,7];
    }
    else {
      
      var rec =  split_string.find(x=> x.substring(0,5) == "BYDAY");
      var days = rec.split(/,|=/);


      if(days !== undefined) {
      days.forEach(day => {
        switch(day) {
          case "SU":
            recurringDays.push(0);
            break;
          case "MO":
            recurringDays.push(1);
            break;
          case "TU":
            recurringDays.push(2);
            break;
          case "WE":
            recurringDays.push(3);
            break;
          case "TH":
            recurringDays.push(4);
            break;
          case "FR":
            recurringDays.push(5);
            break;
          case "SA":
            recurringDays.push(6);
            break;
          default:
            break;
        }
        
    });
  }
    }
    return recurringDays;
  }

  setupEvents() {



    var events = [];
    for (const fields of Object.entries(calendarListEvents)) {

      var calendarName = fields[0];
      var calendarContent = fields[1];


      if ('items' in calendarContent) {
        for (const event of (calendarContent.items)){
          
          if( 'dateTime' in event.start && 'dateTime' in event.end) {

            if( 'recurrence' in event) {
              events.push({ // this object will be "parsed" into an Event Object
                title: event.summary, 
                daysOfWeek: this.getRecurr(event.recurrence[0]),
                startTime: this.getTimeString(event.start.dateTime),
                endTime: this.getTimeString(event.end.dateTime), 
                startRecur: event.start.dateTime,
              }
            );
            }
            else {
              events.push({ // this object will be "parsed" into an Event Object
                title: event.summary, 
                start: event.start.dateTime, 
                end: event.end.dateTime, 
              }
            );    
            }
        
          }
        }
      }

    }
    this.calendarOptions.events = events;
  }


}
