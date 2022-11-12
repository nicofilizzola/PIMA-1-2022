import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { BoundsCheckerService } from '../../shared/services/bounds-checker/bounds-checker.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GcalCalendarGeneratorService } from 'src/app/shared/services/gcal/gcal-calendar-generator/gcal-calendar-generator.service';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';
import { BindEvent } from 'src/app/models/gcal-response/bindEvent/bind-event.model';

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

  //La liste des bindEvent est un obs : Des que sa taille est bonne => On fait un truc.
  bindEventList$ = new Subject<[BindEvent]>();
  bindEventList : [BindEvent]

  private _bindEventSubscription : Subscription;
  private _bindEventListModificationSubscription: Subscription;

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

  ngOnInit(): void {
    //Ajout d'un bindEvent dans la liste, a chaque fois qu'un d'entre eux est push.
    this._bindEventSubscription = this._bindEventResponse$.subscribe((bindEvent) => {
      this.bindEventList$.next(this.newList(bindEvent));
    })

    this._bindEventListModificationSubscription = this.bindEventList$.subscribe(() => {
      if
    })
  }

  newList(bindEvent){
    var newlist =  this.bindEventList
    newlist.push(bindEvent);
    this.bindEventList = newlist
    return newlist
  }

  ngOnDelete(){
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

  onValidate(){
    this.clearBindEventList();
    this.requestBindEvent$.emit();

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
  clearBindEventList(){

  }

  //TODO
  isSelectionOk(){
    return true
  }

  //TODO
  //Return a mapping of calendarsId to list of events which belongs to them.
  eventList(){
    
  }

  //Solution plus opti ? Comment fait le bouton suppr tous ?
  removeAllItems(){
    for (var i in this.items){
      this.onDeleteItem(i)
    }
  }
}
