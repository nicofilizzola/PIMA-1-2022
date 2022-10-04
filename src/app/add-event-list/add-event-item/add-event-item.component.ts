import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-event-item',
  templateUrl: './add-event-item.component.html',
  styleUrls: ['./add-event-item.component.scss'],
})
export class AddEventItemComponent {
  isVisible = true;
  @Input() itemId;
  @Input() isDeletable;
  @Output() deleteItem = new EventEmitter<number>();

  onDeleteItem() {
    this.deleteItem.emit(this.itemId);
  }
}
