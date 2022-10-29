import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BoundsCheckerService } from '../shared/services/bounds-checker/bounds-checker.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-event-list',
  templateUrl: './add-event-list.component.html',
  styleUrls: ['./add-event-list.component.scss'],
})
export class AddEventListComponent implements OnInit {
  collapsedItem$ = new Subject<number>();

  items = [1];
  expandedItem = 1;
  lower = '09:00';
  higher = '18:00';
  errorMessageOn = false;

  constructor(
    private _boundsCheckerService: BoundsCheckerService,
    private _modalService: NgbModal
  ) {}

  ngOnInit(): void {}

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

  onExpandItem(itemId) {
    this.expandedItem = itemId;
    this.collapsedItem$.next(this.expandedItem);
  }

  isItemsLengthGreaterThan1() {
    return this.items.length > 1;
  }
}
