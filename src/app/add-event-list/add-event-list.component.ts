import { Component, OnInit } from '@angular/core';
import { trigger, state, style } from '@angular/animations';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-event-list',
  templateUrl: './add-event-list.component.html',
  styleUrls: ['./add-event-list.component.scss'],
})
export class AddEventListComponent implements OnInit {
  items = [1];

  constructor(private modalService : NgbModal) { }

  ngOnInit(): void {
  }

  onAddItem(){
    let greatestItemId = Math.max(...this.items)
    this.items[this.items.length] = greatestItemId + 1
  }

  onDeleteItem(itemId){
    let deleteIndex = this.items.indexOf(itemId);
    if (this.items.length == 1) {
      return;
    } 
    if (deleteIndex > -1) { // only splice array when item is found
      this.items.splice(deleteIndex, 1); // 2nd parameter means remove one item only
    }
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
