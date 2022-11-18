import { Injectable } from '@angular/core';
import { first, Subscription } from 'rxjs';
import { GcalCalendarList, GcalCalendarListEntry } from 'src/app/models/calendar-list.model';
import { GcalEvent, GcalEventInstances, GcalEventList, GcalEventListEntry } from 'src/app/models/event.model';
import { GcalHttpService } from '../gcal-http/gcal-http.service';
import { GcalStorageService } from '../gcal-storage/gcal-storage.service';

@Injectable({
  providedIn: 'root',
})
export class GcalRequestHandlerService {
  private _eventInstancesSubscription: Subscription;
  /**
   * @note used for managing the `dataFetched$` stream
   */
  private _calendarsWithRecurringEvents = [];

  constructor(
    private _gcalHttpService: GcalHttpService,
    private _gcalStorageService: GcalStorageService
  ) {}

  fetchData() {
    this._gcalHttpService.fetchCalendarList();
    this._handleEventListFetch();
    this._handleEventInstancesFetch();
    this._handleDataFetchedStream();
  }

  /**
   * @see this.fetchData
   */
  private _handleEventListFetch() {
    this._gcalStorageService.calendarList$.subscribe(
      (calendarList: GcalCalendarList) => {
        if (calendarList === null) return; // skip init value

        calendarList.forEach((calendarListEntry: GcalCalendarListEntry) => {
          this._gcalHttpService.fetchCalendarEvents(calendarListEntry.id);
        });
      }
    );
  }

  /**
   * @see this.fetchData
   * @todo Find a dynamic way to unsubscribe
   */
  private _handleEventInstancesFetch() {
    let subscription = this._gcalStorageService.eventList$.subscribe(
      (eventList: GcalEventList) => {
        if (eventList === null) return; // skip init value

        Object.entries(eventList).forEach((eventListEntry: GcalEventListEntry) => {
          let calendarId = eventListEntry[0];
          let events = eventListEntry[1];
          events.forEach((event: GcalEvent) => {
            if ('recurrence' in event) {
              if (!this._calendarsWithRecurringEvents.includes(calendarId)) {
                this._calendarsWithRecurringEvents.push(calendarId);
              }

              this._gcalHttpService.fetchRecurringEventInstances(
                calendarId,
                event.id
              );
            }
          });
        });
      }
    );

    setTimeout(() => {
      subscription.unsubscribe();
    }, 5000);
  }

  /**
   * @brief Updates the dataFetched$ stream only after all events are fetched from all calendars
   * @note Currently only subscribes to `eventInstances$` since it's the last one of the sequence,
   * meaning that in order for `eventInstances` to be done `eventList` and calendarList must also be.
   * @see this.fetchData
   */
  private _handleDataFetchedStream() {
    this._eventInstancesSubscription =
      this._gcalStorageService.eventInstances$.subscribe(
        (eventInstances: GcalEventInstances) => {
          if (eventInstances == null) return; // skip init value

          if (
            Object.entries(eventInstances).length <
            this._calendarsWithRecurringEvents.length
          ) {
            return;
          }
          return this._gcalStorageService.dataFetched$.next(true);
        }
      );

    this._gcalStorageService.dataFetched$.pipe(first()).subscribe(() => {
      // first() unsubscribes after first observation
      this._eventInstancesSubscription.unsubscribe();
    });
  }
}
