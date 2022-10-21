import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, Output, EventEmitter } from '@angular/core';
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
          height: '400px', // must be responsive
          opacity: '1',
          overflow: 'hidden',
        })
      ),
      state(
        'on-sm',
        style({
          height: '1100px', // must be responsive
          opacity: '1',
          overflow: 'hidden',
        })
      ),
      transition('* <=> void', animate('0.3s ease-out')),
    ]),
  ],
})
export class AddEventItemComponent {
  @Input() itemId;
  @Input() isDeletable;
  @Output() deleteItem = new EventEmitter<number>();
  fixedEvent = false;
  consecutiveInstances = false;
  instanceTotal = 1;
  advancedOptionsActive = false;
  advancedOptionsAnimationState = 'off';

  constructor(private _viewportService: ViewportService) {}

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

  setInstanceTotal(instanceTotal: number) {
    this.instanceTotal = instanceTotal;
  }

  isConsecutiveInstancesInputDisabled() {
    return this.instanceTotal < 2 || this.fixedEvent;
  }

  /**
   * @TODO
   */
  getMaxInstancesPerDay() {}

  /**
   * @TODO
   */
  getMinInstancesPerDay() {}

  getAdvancedOptionsAnimationState() {
    if (this.advancedOptionsActive === false) return 'off';
    if (this._viewportService.isXs() || this._viewportService.isSm())
      return 'on-sm';
    return 'on';
  }
}
