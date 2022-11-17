import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import { CalendarOptions } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import { GcalEvent, GcalEventList, GcalEventListEntry } from 'src/app/models/event.model';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class GcalCalendarComponent implements OnInit, OnDestroy {
  fetchedGcalEvents: GcalEventList;
  dataFetchedSubscription: Subscription;
  /**
   * This property is used as a temporary storage for events to prevent a bug related to **fullGcalCalendar**'s configuration
   */
  tempGcalEvents = [];

  @ViewChild('myGcalCalendar') myGcalCalendar: ElementRef;

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

  ngOnInit(): void {
    this._setup();
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

  _setup() {
    this.dataFetchedSubscription =
      this._gcalStorageService.dataFetched$.subscribe(() => {
        this.fetchedGcalEvents = this._gcalStorageService.getGcalEventList();

        this._clearGcalCalendarData();
        this._populateGcalCalendarData();
        this._handleGcalCalendarRendering();
      });

  }

  private _populateGcalCalendarData() {
    Object.entries(this.fetchedGcalEvents).forEach(
      (eventListEntry: GcalEventListEntry) => {
        eventListEntry[1].forEach((event: GcalEvent) => {
          if (event.recurrence) {
            return this._appendRecurringGcalEvent(event);
          }
          return this._appendRegularGcalEvent(event);
        });
      }
    );
  }

  private _clearGcalCalendarData() {
    this.tempGcalEvents = [];
    this.calendarOptions.events = [];
  }

  private _handleGcalCalendarRendering() {
    this.calendarOptions.events = this.tempGcalEvents;
    let calendar = new Calendar(
      this.myGcalCalendar.nativeElement,
      this.calendarOptions
    );
    calendar.render();
  }

  private _appendRecurringGcalEvent(event: GcalEvent) {
    this.tempGcalEvents.push({
      title: event.summary,
      daysOfWeek: this.getRecurr(event.recurrence[0]),
      startTime: this.getTimeString(event.start.dateTime),
      endTime: this.getTimeString(event.end.dateTime),
      startRecur: event.start.dateTime,
      endRecur: this.getEndRecurr(event.recurrence[0]),
    });
  }

  private _appendRegularGcalEvent(event: GcalEvent) {
    this.tempGcalEvents.push({
      title: event.summary,
      start: event.start.dateTime,
      end: event.end.dateTime,
    });
  }

  ngOnDestroy(): void {
    this.dataFetchedSubscription.unsubscribe();
  }
}
