import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
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
export class AddEventItemComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;

  @Input() expandedItem$: Subject<number>;
  @Input() itemId;
  @Input() isDeletable;

  /**
   * @brief Communicate to parent if current item deleted
   */
  @Output() deleteItem = new EventEmitter<number>();

  advancedOptionsActive = false;
  collapsed = false;

  title = '';
  dureeEnHeures = 1;
  priorite = 'Choisir priorité...';
  calendrier = 'Choisir calendrier...';
  localisation;
  instanceTotal = 1;
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

  ngOnInit() {
    this.expandedItem$.next(this.itemId);

    this._subscription = this.expandedItem$.subscribe((expandedId) => {
      if (expandedId != this.itemId) {
        console.log(this.itemId)
        this.collapsed = true;
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  onDeleteItem(event: MouseEvent) {
    event?.stopPropagation(); // avoid triggering parent event

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

  onCollapse() {
    if (this.title === '') {
      this.title = 'Untitled task';
    }
    this.collapsed = true;
  }

  onExpand() {
    this.collapsed = false;
    this.expandedItem$.next(this.itemId);
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
