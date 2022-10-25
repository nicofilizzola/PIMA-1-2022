import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-add-event-item',
  templateUrl: './add-event-item.component.html',
  styleUrls: ['./add-event-item.component.scss'],
})
export class AddEventItemComponent {

  private eventsSubscription: Subscription;

  @Input() closeItem: Observable<number>;
  @Input() itemId;
  @Input() isDeletable;
  @Output() deleteItem = new EventEmitter<number>();
  @Output() openItem = new EventEmitter<number>();
  
  ngOnInit(){
    this.eventsSubscription = this.closeItem.subscribe((openedId) => this.onCloseItem(openedId));
  }

  ngOnDestroy(){
    this.eventsSubscription.unsubscribe();
  }

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
    this.openItem.emit(this.itemId);
  }

  onCloseItem(openedId){
    if(this.itemId != openedId){
      this.onToggleCollapsed()
    }
  }
}
