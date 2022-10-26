import { Component, OnInit } from '@angular/core';
import { CalendarOptions, defineFullCalendarElement, DateSelectArg } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Calendar } from '@fullcalendar/core';
import rrulePlugin from '@fullcalendar/rrule'
import { GcalService } from '../shared/services/gcal/gcal.service';
import { CalendarList, CalendarListEntry } from '../models/calendar-list.model'
import { ONE_DAY_AGO, ONE_MONTH_AGO, ONE_WEEK_AGO } from 'src/app/constants';
import { Event, EventList } from 'src/app/models/event.model';

// make the <full-calendar> element globally available by calling this function at the top-level
defineFullCalendarElement();

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  

  //Array of all events to display on the calendar
  events = [];

  //calendarOptions used to create the calendar
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
    events: this.events,
    
  };
  constructor(private gcal : GcalService) { }

  ngOnInit(): void {

    this.setUpCalendar();
  }

  /**
   * 
   * @param str String respecting ISO 8601 date and time
   * @returns string containing only time
   */
  getTimeString(str) {
    return str.substring(str.indexOf("T") + 1);
  }

  /**
   * 
   * @param str String respecting RRULE format
   * @returns date after "UNTIL=" if it exists. Otherwise the result is undefined
   * */
  getEndRecurr(str) {
    return (str.substring(
      str.indexOf("UNTIL=") + 6, 
      str.lastIndexOf("T")));
  }
  /**
   * @param str String respecting RRULE format
   * @returns array containing ints corresponding to days of recurrence from a RRULE string
   *        (Sunday --> 0, Monday --> 1, ..., Saturday --> 6) */
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

  setUpCalendar() {

    //Array of calendar's id that are already taken into account 
    var calendarIdListSeen = [];

    //Subscribing to the calendarList
    this.gcal.calendarList$.subscribe( (_calendarList: CalendarList) => {
      _calendarList.forEach( calendar => {
        this.gcal.fetchCalendarEvents(calendar.id,ONE_MONTH_AGO);
      })
      } );

    //Subscribing to the eventList
    this.gcal.eventList$.subscribe ( (_eventList: EventList) => {
      if (_eventList != null) {

        for (const fields of Object.entries(_eventList) ){

          var calendarId = fields[0];

          if (true) 
          {
            var eventlist = fields[1];

            eventlist.forEach( _event => 
            {
              if(_event["start"]["dateTime"] != undefined && _event["end"]["dateTime"]) 
              {
                
                if(_event["recurrence"]!=undefined) 
                {
                  this.events.push({
                    title: _event["summary"],
                    daysOfWeek: this.getRecurr(_event["recurrence"][0]),
                    startTime: this.getTimeString(_event["start"]["dateTime"]),
                    endTime: this.getTimeString(_event["end"]["dateTime"]),
                    startRecur: _event["start"]["dateTime"],
                    endRecur: this.getEndRecurr(_event["recurrence"][0]),
                  })
                }
                else 
                {
                  this.events.push({ 
                    title: _event["summary"], 
                    start: _event["start"]["dateTime"], 
                    end: _event["end"]["dateTime"], 
                  }
                );    
                }
              }
            })
            
          } 
        }

        this.calendarOptions.events = this.events;
        let calendar = new Calendar(document.getElementById("calendar"), this.calendarOptions);
        calendar.render();
    }

  })

  this.gcal.fetchCalendarList();
  
  }


}
