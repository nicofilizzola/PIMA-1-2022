import { Component, OnInit } from '@angular/core';
import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { calendarListEvents } from 'src/fixtures/fixtures';
import rrulePlugin from '@fullcalendar/rrule'
import { start } from '@popperjs/core';


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
                title: event.summary, // a property!
                start: event.start.dateTime, // a property!
                end: event.end.dateTime, 
                rrule: 'DTSTART:'+event.start.dateTime + '\n' + event.recurrence,
                color: '#378006',
              }
            );
            console.log( event.summary + ": \n avec:"+ 'DTSTART:'+event.start.dateTime + '\n' + event.recurrence+ "Apparemment c'est: " + event.start.dateTime );        
            }
            else {
              events.push({ // this object will be "parsed" into an Event Object
                title: event.summary, // a property!
                start: event.start.dateTime, // a property!
                end: event.end.dateTime, // a property! ** see important note below about 'end' **
                color: '#378006',
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
