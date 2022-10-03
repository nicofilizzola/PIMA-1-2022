import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-event-list',
  templateUrl: './add-event-list.component.html',
  styleUrls: ['./add-event-list.component.scss']
})
export class AddEventListComponent implements OnInit {
  items = [1];

  constructor() { }

  ngOnInit(): void {
  }

  onAddItem(){
    this.items[this.items.length] = this.items.length
  }

  onDeleteItem(itemId){
    let deleteIndex = this.items.indexOf(itemId);

    if (deleteIndex > -1) { // only splice array when item is found
      this.items.splice(deleteIndex, 1); // 2nd parameter means remove one item only
    }
  }
}
