import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { BoundsCheckerService } from '../../shared/services/bounds-checker/bounds-checker.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GcalCalendarGeneratorService } from 'src/app/shared/services/gcal/gcal-calendar-generator/gcal-calendar-generator.service';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';
import { BindEvent } from 'src/app/models/gcal-response/bindEvent/bind-event.model';
import { Calendar } from '@fullcalendar/core';

@Component({
  selector: 'app-add-event-list',
  templateUrl: './add-event-list.component.html',
  styleUrls: ['./add-event-list.component.scss'],
})
export class AddEventListComponent implements OnInit {
  expandedItem$ = new Subject<number>();
  requestBindEvent$ = new EventEmitter();

  //Observable pour la reponse des enfants.
  _bindEventResponse$ = new Observable<BindEvent>();

  bindEventList: BindEvent[];

  private _bindEventSubscription: Subscription;

  items = [1];
  lower = '09:00';
  higher = '18:00';
  errorMessageOn = false;

  constructor(
    private _boundsCheckerService: BoundsCheckerService,
    private _modalService: NgbModal,
    private _gcalGeneratorService: GcalCalendarGeneratorService
  ) {}

  ngOnInit(): void {
    //Ajout d'un bindEvent dans la liste, a chaque fois qu'un d'entre eux est push.
    this._bindEventSubscription = this._bindEventResponse$.subscribe(
      (bindEvent) => {
        this.bindEventList.push(bindEvent);
        if (this.bindEventList.length == this.items.length) {
          this.generate();
        }
      }
    );
  }

  ngOnDelete() {
    this._bindEventSubscription.unsubscribe();
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

  onOpenClearModal(targetModal) {
    this._modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg',
    });
  }

  isItemsLengthGreaterThan1() {
    return this.items.length > 1;
  }

  onValidate() {
    this.clearBindEventList();
    this.requestBindEvent$.emit();
  }

  generate() {
    if (!this.isSelectionOk()) {
      return;
    }
    this._gcalGeneratorService.setListEvent(this.eventMap());
    this.removeAllItems();
  }

  clearBindEventList() {
    while (this.bindEventList.length > 0) {
      this.bindEventList.pop();
    }
  }

  //TODO
  isSelectionOk() {
    return true;
  }

  //TODO
  //Return a mapping of calendarsId to list of events which belongs to them.
  eventMap() {
    var map = new Map<String, Event[]>();
    this.bindEventList.forEach((bindEvent) => {
      var id = bindEvent.calendarId;
      if (map.has(id)) {
        var list = map.get(id);
        list.push(bindEvent.event);
      } else {
      }
    });
    return map;
  }

  removeAllItems() {
    for (var i in this.items) {
      this.onDeleteItem(i);
    }
  }
}
