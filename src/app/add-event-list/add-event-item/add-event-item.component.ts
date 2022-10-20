import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  advancedOptionsActive = false;
  collapsed = false; 
  title = "";

  onDeleteItem() {
    this.deleteItem.emit(this.itemId);
  }

  onToggleFixedEvent() {
    this.fixedEvent = !this.fixedEvent;

    if (this.consecutiveInstances) {
      this.consecutiveInstances = false;
    }
  }

  setAdvancedOptionsActive(advancedOptionsActive: boolean) {
    this.advancedOptionsActive = advancedOptionsActive;
  }

  setInstanceTotal(instanceTotal: number){
    this.instanceTotal = instanceTotal
    console.log(this.instanceTotal)
  }

  isConsecutiveInstancesInputDisabled(){
    return this.instanceTotal < 2 || this.fixedEvent
  }

  /**
   * @TODO
   */
  getMaxInstancesPerDay() {}

  /**
   * @TODO
   */
  getMinInstancesPerDay() {}

  onToggleCollapsed() {
    this.collapsed = true;
  }

  onToggleUnCollapsed(){
    this.collapsed = false;
  }
}
