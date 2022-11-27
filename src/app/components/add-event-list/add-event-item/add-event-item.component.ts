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
  ChangeDetectorRef,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ViewportService } from 'src/app/shared/services/viewport/viewport.service';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';
import { EventConstraints } from 'src/app/models/event-constraints.model';

const COLLAPSED_ANIMATION_STATE = {
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded',
};

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
  private _expendedItemSubscription: Subscription;
  private _requestItemSubscription: Subscription;

  @Input() expandedItem$: Subject<number>;
  @Input() itemId: number;
  @Input() isDeletable: Subject<boolean>;
  @Input() requestItem: Subject<string>;
  @Input() responseItem: BehaviorSubject<EventConstraints[]>; //Observable which will collect the EventConstraints

  // Load the calendarList one single time for all the addEventItem components
  @Input() calendarList;

  /**
   * @brief Communicate to parent if current item deleted
   */
  @Output() deleteItem = new EventEmitter<number>();

  collapsed = false;

  // Base options
  title: string;
  hourDuration = 1;
  minuteDuration = 0;
  priority = 'Choisir priorité...';
  calendar = '0';
  errorMessageOn = false;

  // Advanced options
  advancedOptionsActive = false;
  location: string;
  instanceTotal = 1;
  minDailyInstances: number;
  maxDailyInstances: number;
  lowerBound: string;
  upperBound: string;
  margin: number;
  date: string;
  time: string;
  description: string;
  fixedEvent = false;
  consecutiveInstances = false;

  constructor(
    private _viewportService: ViewportService,
    private _cd: ChangeDetectorRef,
    private _gcalStorageService: GcalStorageService,
    private _modalService: NgbModal
  ) {}

  ngOnInit() {
    this.expandedItem$.next(this.itemId);
    this._expendedItemSubscription = this.expandedItem$.subscribe((expandedId) => {
      if (expandedId != this.itemId) {
        this.onCollapse();

        this._cd.detectChanges(); // Prevents error after template-used property is changed (this.collapsed)
      }
    });
    this._requestItemSubscription = this.requestItem.subscribe(() => {
      this.responseItem.next([...this.responseItem.getValue(),this.generateEventConstraints()]);
    })
  }

  onGetSummary(calendarId) {
    return this._gcalStorageService.getCalendarSummary(calendarId);
  }

  ngOnDestroy() {
    this._expendedItemSubscription.unsubscribe();
    this._requestItemSubscription.unsubscribe();
  }

  onCheckValidTime() {
    if (
      this.minuteDuration > 59 ||
      this.hourDuration > 23 ||
      this.minuteDuration < 0 ||
      this.hourDuration < 0 ||
      this.minuteDuration % 1 != 0 ||
      this.hourDuration % 1 != 0
    ) {
      this.errorMessageOn = true;
    } else {
      this.errorMessageOn = false;
    }
  }
  onDeleteItem(event: MouseEvent) {
    event?.stopPropagation(); // Avoids triggering parent event

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

  onOpenDeleteModal(targetModal) {
    this._modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg',
    });
  }

  formEmpty() {
    // Check if an input from the form has been changed
    if (
      this.title !== undefined ||
      this.hourDuration !== 1 ||
      this.minuteDuration !== 1 ||
      this.priority !== 'Choisir priorité...' ||
      this.calendar !== '0' ||
      this.location !== undefined ||
      this.instanceTotal !== 1 ||
      this.minDailyInstances !== undefined ||
      this.maxDailyInstances !== undefined ||
      this.lowerBound !== undefined ||
      this.upperBound !== undefined ||
      this.margin !== undefined ||
      this.date !== undefined ||
      this.time !== undefined ||
      this.description !== undefined ||
      this.fixedEvent === true ||
      this.consecutiveInstances === true
    ) {
      return false;
    }
    return true;
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
    if (this.title == null) {
      this.title = `Tâche sans nom ${this.itemId}`;
    }
    this.collapsed = true;

    this.advancedOptionsActive = false;
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

  generateEventConstraints(){
    return new EventConstraints(this);
  }
}
