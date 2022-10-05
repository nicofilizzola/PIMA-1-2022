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
  fixedEvent = false;
  consecutiveInstances = false;
  instanceTotal = 1;

  onDeleteItem() {
    this.deleteItem.emit(this.itemId);
  }

  onToggleFixedEvent() {
    this.fixedEvent = !this.fixedEvent;

    if (this.consecutiveInstances) {
      this.consecutiveInstances = false;
    }
  }

  /**
   * @TODO
   */
  getMaxInstancesPerDay(){
  
  }

  /**
   * @TODO
   */
  getMinInstancesPerDay(){
  
  }
}
