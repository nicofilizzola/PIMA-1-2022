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
import {
  GcalEvent,
  GcalEventList,
  GcalEventListEntry,
} from 'src/app/models/gcal/event.model';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';
import { Subscription } from 'rxjs';
import { GcalCalendarList } from 'src/app/models/gcal/calendar-list.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  fetchedEvents: GcalEventList;
  fetchedCalendarList: GcalCalendarList;
  dataFetchedSubscription: Subscription;
  calendarColors: { id: string; name: string; color: string }[] = [];
  /**
   * This property is used as a temporary storage for events to prevent a bug related to **fullGcalCalendar**'s configuration
   */
  tempEvents = [];

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
    allDaySlot: false,
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
        this.fetchedEvents = this._gcalStorageService.getEventList();
        this.fetchedCalendarList = this._gcalStorageService.getCalendarList();

        this._clearCalendarData();
        this._populateCalendarData();
        this._handleCalendarRendering();
      });
  }

  private _populateCalendarData() {
    Object.entries(this.fetchedEvents).forEach(
      (eventListEntry: GcalEventListEntry) => {
        let calendarId: string = eventListEntry[0];

        eventListEntry[1].forEach((event: GcalEvent) => {
          let backgroundColor = this._handleCalendarColor(calendarId);
          if (event.recurrence) {
            return this._appendRecurringEvent(event, backgroundColor);
          }
          return this._appendRegularEvent(event, backgroundColor);
        });
      }
    );
  }

  private _clearCalendarData() {
    this.tempEvents = [];
    this.calendarOptions.events = [];
  }

  private _handleCalendarRendering() {
    this.calendarOptions.events = this.tempEvents;
    let calendar = new Calendar(
      this.myCalendar.nativeElement,
      this.calendarOptions
    );
    calendar.render();
  }

  private _appendRecurringEvent(event: GcalEvent, backgroundColor: string) {
    this.tempEvents.push({
      title: event.summary,
      daysOfWeek: this.getRecurr(event.recurrence[0]),
      startTime: this.getTimeString(event.start.dateTime),
      endTime: this.getTimeString(event.end.dateTime),
      startRecur: event.start.dateTime,
      endRecur: this.getEndRecurr(event.recurrence[0]),
      color: backgroundColor,
    });
  }

  private _appendRegularEvent(event: GcalEvent, backgroundColor: string) {
    this.tempEvents.push({
      title: event.summary,
      start: event.start.dateTime,
      end: event.end.dateTime,
      color: backgroundColor,
    });
  }

  private _getBackgroundColor(calendarId: string) {
    return this.fetchedCalendarList.find(
      (calendar) => calendar.id == calendarId
    ).backgroundColor;
  }

  private _handleCalendarColor(calendarId: string) {
    let backgroundColor = this._getBackgroundColor(calendarId);

    let calendarColor = {
      id: calendarId,
      name: this._gcalStorageService.getCalendarSummary(calendarId),
      color: backgroundColor,
    };

    this.calendarColors
      .map(function (elt) {
        return elt.id;
      })
      .indexOf(calendarId) === -1
      ? this.calendarColors.push(calendarColor)
      : null;

    return backgroundColor;
  }

  ngOnDestroy(): void {
    this.dataFetchedSubscription.unsubscribe();
  }
}
