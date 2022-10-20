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
  
  advancedOptionsActive = false;
  collapsed = false; 

  title = "";
  dureeEnHeures=1; 
  priorite="Choisir priorité..."; 
  calendrier="Choisir calendrier..."; 
  localisation; 
  instanceTotal=1;
  minInstancesParJour; 
  maxInstancesParJour; 
  borneInf; 
  borneSup; 
  marge; 
  itemDate; 
  itemHour; 
  description;
  fixedEvent = false;
  consecutiveInstances = false;

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
    if( this.title === "" ){
      this.title = "Untitled task"
    }
    this.collapsed = true;
  }

  onToggleUnCollapsed(){
    this.collapsed = false;
  }
}
