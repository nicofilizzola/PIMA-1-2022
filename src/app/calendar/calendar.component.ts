import { Component, OnInit } from '@angular/core';
import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { calendarListEvents } from 'src/fixtures/fixtures';
import rrulePlugin from '@fullcalendar/rrule'
import { start } from '@popperjs/core';
import { GapiService } from '../shared/services/gapi/gapi.service';


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


  constructor() { }

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
    var days = rec.split(",");


    if(days !== undefined) {
    days.forEach(day => {
      switch(day) {
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
        case "SU":
          recurringDays.push(7);
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
              console.log(event.summary);
              events.push({ // this object will be "parsed" into an Event Object
                title: event.summary, // a property!
                daysOfWeek: this.getRecurr(event.recurrence[0]),
                startTime: this.getTimeString(event.start.dateTime), // a property!
                endTime: this.getTimeString(event.end.dateTime), 
              }
            );
            }
            else {
              events.push({ // this object will be "parsed" into an Event Object
                title: event.summary, // a property!
                start: event.start.dateTime, // a property!
                end: event.end.dateTime, // a property! ** see important note below about 'end' **
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
