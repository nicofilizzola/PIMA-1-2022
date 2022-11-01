import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import { CalendarOptions } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import { Event, EventList, EventListEntry } from 'src/app/models/event.model';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements AfterViewInit, OnDestroy {
  fetchedEvents: EventList;
  dataFetchedSubscription: Subscription;
  events = [];

  @ViewChild('myCalendar') myCalendar: ElementRef;

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, dayGridPlugin, rrulePlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    initialView: 'timeGridWeek',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
  };
  constructor(private _gcalStorageService: GcalStorageService) {}

  ngAfterViewInit(): void {
    this.setupCalendar();
  }

  /**
   *
   * @param str String respecting ISO 8601 date and time
   * @returns string containing only time
   */
  getTimeString(str) {
    return str.substring(str.indexOf('T') + 1);
  }

  /**
   *
   * @param str String respecting RRULE format
   * @returns date after "UNTIL=" if it exists. Otherwise the result is undefined
   * */
  getEndRecurr(str) {
    return str.substring(str.indexOf('UNTIL=') + 6, str.lastIndexOf('T'));
  }
  /**
   * @param str String respecting RRULE format
   * @returns array containing ints corresponding to days of recurrence from a RRULE string
   *        (Sunday --> 0, Monday --> 1, ..., Saturday --> 6) */
  getRecurr(str) {
    var recurringDays = [];

    var split_string = str.split(/;|:/);

    var type_recurr = split_string.find((x) => x.substring(0, 5) == 'FREQ=');

    if (type_recurr == 'FREQ=DAILY') {
      recurringDays = [0, 1, 2, 3, 4, 5, 6];
    } else {
      var rec = split_string.find((x) => x.substring(0, 5) == 'BYDAY');
      var days = rec.split(/,|=/);

      if (days !== undefined) {
        days.forEach((day) => {
          switch (day) {
            case 'SU':
              recurringDays.push(0);
              break;
            case 'MO':
              recurringDays.push(1);
              break;
            case 'TU':
              recurringDays.push(2);
              break;
            case 'WE':
              recurringDays.push(3);
              break;
            case 'TH':
              recurringDays.push(4);
              break;
            case 'FR':
              recurringDays.push(5);
              break;
            case 'SA':
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

  setupCalendar() {
    this.dataFetchedSubscription =
      this._gcalStorageService.dataFetched$.subscribe(() => {
        this.fetchedEvents = this._gcalStorageService.getEventList()

        Object.entries(this.fetchedEvents).forEach(
          (eventListEntry: EventListEntry) => {
            eventListEntry[1].forEach((event: Event) => {
              if (event.recurrence) {
                return this._appendRecurringEvent(event);
              }
              return this._appendRegularEvent(event);
            });
          }
        );

        this.calendarOptions.events = this.events;
        let calendar = new Calendar(
          this.myCalendar.nativeElement,
          this.calendarOptions
        );
        calendar.render();
      });
  }

  private _appendRecurringEvent(event: Event) {
    this.events.push({
      title: event.summary,
      daysOfWeek: this.getRecurr(event.recurrence[0]),
      startTime: this.getTimeString(event.start.dateTime),
      endTime: this.getTimeString(event.end.dateTime),
      startRecur: event.start.dateTime,
      endRecur: this.getEndRecurr(event.recurrence[0]),
    });
  }

  private _appendRegularEvent(event: Event) {
    this.events.push({
      title: event.summary,
      start: event.start.dateTime,
      end: event.end.dateTime,
    });
  }

  ngOnDestroy(): void {
    this.dataFetchedSubscription.unsubscribe();
  }
}
