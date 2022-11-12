import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BoundsCheckerService } from '../../shared/services/bounds-checker/bounds-checker.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GcalCalendarGeneratorService } from 'src/app/shared/services/gcal/gcal-calendar-generator/gcal-calendar-generator.service';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';

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

  constructor(
    private _boundsCheckerService: BoundsCheckerService,
    private _modalService: NgbModal,
    private _gcalGeneratorService: GcalCalendarGeneratorService,
    private _gcalStorageService: GcalStorageService
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

  isItemsLengthGreaterThan1() {
    return this.items.length > 1;
  }

  onValidate(){
    if(!this.isSelectionOk()){
      console.log("Mauvaise selection")
      return
    }
    this._gcalGeneratorService.setListEvent(this.eventList())
    this._gcalGeneratorService.generate()
    this._gcalStorageService.pushDataAPI()
    this.removeAllItems()
  }

  //TODO
  isSelectionOk(){
    return true
  }

  //TODO
  //Return a mapping of calendarsId to list of events which belongs to them.
  eventList(){
    var eventList=[]
    for (var i in this.items){
      var event = this.getEventItem(i)
    }
  }

  getEventItem(i){
    
  }

  //Solution plus opti ? Comment fait le bouton suppr tous ?
  removeAllItems(){
    for (var i in this.items){
      this.onDeleteItem(i)
    }
  }
}
