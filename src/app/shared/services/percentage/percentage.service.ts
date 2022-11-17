import { Injectable } from '@angular/core';
import { first } from 'rxjs';
import { GcalEvent, GcalEventList, GcalEventListEntry } from 'src/app/models/event.model';
import { GcalStorageService } from '../gcal/gcal-storage/gcal-storage.service';

/**
 * @todo recurring events management
 */
@Injectable({
  providedIn: 'root',
})
export class PercentageService {
  private _fetchedGcalEvents: GcalEventList;
  totalGcalEventTime: number;

  constructor(private _gcalStorageService: GcalStorageService) {
    this.initialize();
  }

  /**
   * @note This method must be called whenever there is a relevant data fetch
   */
  public initialize() {
    this._gcalStorageService.dataFetched$.pipe(first()).subscribe(() => {
      this._fetchedGcalEvents = this._gcalStorageService.getGcalEventList();

      this._setTotalGcalEventTime(
        Object.entries(this._fetchedGcalEvents)
          .map((eventListEntry: GcalEventListEntry) => eventListEntry[1])
          .flat()
      );
    });
  }

  /**
   * @returns The calendar's events time percentage in the total event time. The result is rounded to two decimals
   */
  public getGcalCalendarPercentage(calendarId: string): number {
    if (this.totalGcalEventTime == null) {
      return 0;
    }

    let calendarGcalEventsTotalTime = 0;
    let calendarGcalEvents = this._fetchedGcalEvents[calendarId];

    for (let event of calendarGcalEvents) {
      calendarGcalEventsTotalTime += this._getGcalEventDuration(event);
    }

    let percentage = this._getRoundedPercentage(
      (calendarGcalEventsTotalTime / this.totalGcalEventTime) * 100,
      100
    );
    return percentage;
  }

  private _setTotalGcalEventTime(events: GcalEvent[]) {
    let totalTime = 0;

    for (let event of events) {
      totalTime += this._getGcalEventDuration(event);
    }
    this.totalGcalEventTime = totalTime;
  }

  /**
   * @returns The event's duration in seconds
   * @see this._setTotalGcalEventTime
   */
  private _getGcalEventDuration(event: GcalEvent): number {
    const SECOND_IN_TIMESTAMP_FORMAT = 1000;
    let eventStartDate = new Date(event.start.dateTime);
    let eventEndDate = new Date(event.end.dateTime);
    return (
      (eventEndDate.getTime() - eventStartDate.getTime()) /
      SECOND_IN_TIMESTAMP_FORMAT
    );
  }

  /**
   * @brief Rounds `longPercentage` to number of 0s in `roundingCoefficient` (ex: `roundingCoefficient = 100`, rounded to 2 decimals)
   * @param roundingCoefficient must be a power of 10
   * @see this.getGcalCalendarPercentage
   */
  private _getRoundedPercentage(
    longPercentage: number,
    roundingCoefficient: number
  ): number {
    if (
      parseInt(roundingCoefficient.toString().charAt(0)) !== 1 ||
      !this._allDigitsButFirstEqualZero(roundingCoefficient)
    ) {
      console.error(
        'The provided roundingCoefficient is invalid. It should be a power of ten (ex: 10, 100, 1000, ...)'
      );
      return;
    }

    return (
      Math.round(longPercentage * roundingCoefficient) / roundingCoefficient
    );
  }

  /**
   * @see this._getRoundedPercentage
   */
  private _allDigitsButFirstEqualZero(number: number) {
    const digits = number.toString().split('');
    for (let i = 1; i < digits.length; i++) {
      if (parseInt(digits[i]) !== 0) {
        return false;
      }
    }
    return true;
  }
}
