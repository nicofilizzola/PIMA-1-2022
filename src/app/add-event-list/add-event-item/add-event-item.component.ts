import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style } from '@angular/animations';
@Component({
  selector: 'app-add-event-item',
  templateUrl: './add-event-item.component.html',
  styleUrls: ['./add-event-item.component.scss'],
})
export class AddEventItemComponent {
  @Input() itemId;
  @Input() isDeletable;
  @Output() deleteItem = new EventEmitter<number>();

  onDeleteItem() {
    this.deleteItem.emit(this.itemId);
  }
}
