import { Component, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { BoundsCheckerService } from '../../shared/services/bounds-checker/bounds-checker.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';
import { GcalCalendarList } from 'src/app/models/gcal/calendar-list.model';
import { GapiService } from 'src/app/shared/services/gapi/gapi.service';
import { EventConstraints } from 'src/app/models/event-constraints.model';
import { CalendarGeneratorService } from 'src/app/shared/services/calendar-generator/calendar-generator.service';
import { Period } from 'src/app/models/period-tree/period-tree.model';
import { Time } from '@angular/common';

@Component({
  selector: 'app-add-event-list',
  templateUrl: './add-event-list.component.html',
  styleUrls: ['./add-event-list.component.scss'],
})
export class AddEventListComponent implements OnInit {
  expandedItem$ = new Subject<number>();
  requestItem$ = new Subject();
  responseItem$ = new BehaviorSubject<EventConstraints[]>([]);

  responseSubscription: Subscription;

  items = [1];
  lower = '09:00';
  higher = '18:00';
  errorMessageOn = false;

  calendarList: GcalCalendarList;
  dataFetchedSubscription: Subscription;
  periodSelection: string;

  constructor(
    private _boundsCheckerService: BoundsCheckerService,
    private _modalService: NgbModal,
    private _gcalStorageService: GcalStorageService,
    private _gapiService: GapiService,
    private _calendarGeneratorService: CalendarGeneratorService
  ) {}

  ngOnInit(): void {
    this.dataFetchedSubscription =
      this._gcalStorageService.dataFetched$.subscribe(() => {
        this.calendarList = this._gcalStorageService.getCalendarList();

        // Changes the main calendar name to 'GcalEvents' and reverse the list
        let email = this._gapiService.getAuthenticatedUserEmail();
        this.calendarList.reverse();
      });
    this.responseSubscription = this.responseItem$.subscribe((response) => {
      if (response.length == this.items.length) {
        let period = this.getSelectedPeriod();
        let infBound = this.getTimeFromString(this.lower);
        let supBound = this.getTimeFromString(this.higher);
        this._calendarGeneratorService.generate(
          response,
          period,
          infBound,
          supBound
        );
      }
    });
  }

  getCalendarSummary(calendarId): string {
    return this._gcalStorageService.getCalendarSummary(calendarId);
  }

  getSelectedPeriod(): Period {
    if (this.periodSelection == 'day') {
      return new Period(
        new Date(),
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      );
    }
    if (this.periodSelection == 'week') {
      return new Period(
        new Date(),
        new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    }
    if (this.periodSelection == 'month') {
      return new Period(
        new Date(),
        new Date(new Date().getTime() + 4 * 7 * 24 * 60 * 60 * 1000)
      );
    }
  }

  //From '00:00' format
  getTimeFromString(value: string): Time {
    let hours: number =
      (value.charCodeAt(0) - 48) * 10 + value.charCodeAt(1) - 48;
    let minutes: number =
      (value.charCodeAt(3) - 48) * 10 + value.charCodeAt(4) - 48;
    return { hours: hours, minutes: minutes };
  }

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

  /**
   *
   * @param targetModal must match the modal's reference id on the template
   */
  onOpenModal(targetModal) {
    this._modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg',
    });
  }

  onValidateModal() {
    if (!this.isSelectionCorrect()) {
      return;
    }
    this.responseItem$.next([]);
    this.requestItem$.next('');
    this._modalService.dismissAll();
  }

  isSelectionCorrect() {
    return true;
  }

  isItemsLengthGreaterThan1() {
    return this.items.length > 1;
  }
}
