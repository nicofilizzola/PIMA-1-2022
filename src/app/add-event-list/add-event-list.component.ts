import { Component, OnInit } from '@angular/core';
import { trigger, state, style } from '@angular/animations';

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

  constructor() {}

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
      // only splice array when item is found
      this.items.splice(deleteIndex, 1); // 2nd parameter means remove one item only
    }
  }

  onCheckBounds() {
    let lower = {
      hour: parseInt(this.lower.split(':')[0]),
      mins: parseInt(this.lower.split(':')[1]),
    };
    let higher = {
      hour: parseInt(this.higher.split(':')[0]),
      mins: parseInt(this.higher.split(':')[1]),
    };

    if (
      lower.hour > higher.hour ||
      (lower.hour == higher.hour && lower.mins <= higher.mins)
    ) {
      return this.errorMessageOn = true;
    }
    return this.errorMessageOn = false;
  }

  isItemsLengthGreaterThan1() {
    return this.items.length > 1;
  }
}
