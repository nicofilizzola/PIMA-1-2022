import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ViewportService } from 'src/app/shared/services/viewport/viewport.service';
@Component({
  selector: 'app-add-event-item',
  templateUrl: './add-event-item.component.html',
  styleUrls: ['./add-event-item.component.scss'],
  animations: [
    /**
     * @note Snappy animation comes from .aei-advanced margins
     */
    trigger('advancedOptions', [
      state(
        'void',
        style({
          height: '0',
          opacity: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'on',
        style({
          height: '400px',
          opacity: '1',
          overflow: 'hidden',
        })
      ),
      state(
        'on-sm',
        style({
          height: '1100px',
          opacity: '1',
          overflow: 'hidden',
        })
      ),
      transition('* <=> void', animate('0.3s ease-out')),
    ]),
  ],
})
export class AddEventItemComponent {

  private eventsSubscription: Subscription;

  @Input() closeItem: Observable<number>;
  @Input() itemId;
  @Input() isDeletable;
  @Output() deleteItem = new EventEmitter<number>();
  @Output() openItem = new EventEmitter<number>();

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
  advancedOptionsAnimationState = 'off';

  constructor(private _viewportService: ViewportService) {}

  ngOnInit(){
    this.eventsSubscription = this.closeItem.subscribe((openedId) => this.onCloseItem(openedId));
    this.openItem.emit(this.itemId)
  }

  ngOnDestroy(){
    this.eventsSubscription.unsubscribe();
  }

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
  getAdvancedOptionsAnimationState() {
    if (this.advancedOptionsActive === false) {
      return 'off';
    }
    if (this._viewportService.isXs() || this._viewportService.isSm()) {
      return 'on-sm';
    }
    return 'on';
  }
}
