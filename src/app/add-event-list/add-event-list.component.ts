import { Component, OnInit } from '@angular/core';
import { BoundsCheckerService } from '../shared/services/bounds-checker/bounds-checker.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-event-list',
  templateUrl: './add-event-list.component.html',
  styleUrls: ['./add-event-list.component.scss'],
})
export class AddEventListComponent implements OnInit {
  items = [1];
  lower = '09:00';
  higher = '18:00';
  errorMessageOn = false;

  constructor(private _boundsCheckerService: BoundsCheckerService, private modalService : NgbModal) { }

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

  onDeleteAll(){
    let size = this.items.length
    for(let i=0; i< size; i++){
        this.items.pop();
    }
  }

  openDeleteAll(targetModal){
    console.log(this.items)
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  isItemsLengthGreaterThan1(){
    return this.items.length > 1
  }
}
