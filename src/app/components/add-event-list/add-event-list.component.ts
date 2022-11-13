import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { BoundsCheckerService } from '../../shared/services/bounds-checker/bounds-checker.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';
import { CalendarList, CalendarListEntry } from 'src/app/models/calendar-list.model';
import { Calendar } from 'src/app/models/calendar.model';
import { ViewportService } from 'src/app/shared/services/viewport/viewport.service';
import { GapiService } from 'src/app/shared/services/gapi/gapi.service';
import { DEFAULT_CALENDAR_SUMMARY } from 'src/app/constants';

@Component({
  selector: 'app-add-event-list',
  templateUrl: './add-event-list.component.html',
  styleUrls: ['./add-event-list.component.scss'],
})
export class AddEventListComponent implements OnInit {
  expandedItem$ = new Subject<number>();

  items = [1];
  lower = '09:00';
  higher = '18:00';
  errorMessageOn = false;
  calendarList : CalendarList;
  dataFetchedSubscription : Subscription;

  constructor(
    private _boundsCheckerService: BoundsCheckerService,
    private _modalService: NgbModal,
    private _gcalStorageService: GcalStorageService,
    private _gapiService : GapiService
  ) {}

  ngOnInit(): void {
    this.dataFetchedSubscription =
    this._gcalStorageService.dataFetched$.subscribe(() => {
      this.calendarList = this._gcalStorageService.getCalendarList();

      // Changes the main calendar name to 'Events' and reverse the list
      let email = this._gapiService.getAuthenticatedUserEmail();
      this.calendarList.reverse();
  });
  }


  
  getCalendarSummary(calendarId){
    return this._gcalStorageService.getCalendarSummary(calendarId);
  };

  onAddItem() {
    let greatestItemId = Math.max(...this.items);
    this.items[this.items.length] = greatestItemId + 1;
  }

  onDeleteItem(itemId) {
    let deleteIndex = this.items.indexOf(itemId);
    if (this.items.length == 1) {
      return;
    }
    if (deleteIndex > -1) {
      this.items.splice(deleteIndex, 1);
    }
  }

  onCheckBounds() {
    this.errorMessageOn = this._boundsCheckerService.checkTimeBounds(
      this.lower,
      this.higher
    )
      ? false
      : true;
  }

  onClear() {
    const lastItem = this.items[this.items.length - 1];
    this.items = [lastItem + 1];
  }

  onOpenClearModal(targetModal) {
    this._modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg',
    });
  }

  isItemsLengthGreaterThan1() {
    return this.items.length > 1;
  }
}
