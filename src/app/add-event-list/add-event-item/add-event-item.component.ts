import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectionStrategy } from '@angular/compiler';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
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

  collapsed = false;

  // Base options
  title: string;
  hourDuration = 1;
  priority = 'Choisir priorité...';
  calendar = 'Choisir calendrier...';

  // Advanced options
  advancedOptionsActive = false;
  location: string;
  instanceTotal = 1;
  minDailyInstances: number;
  maxDailyInstances: number;
  borneInf: string;
  borneSup: string;
  marge: number;
  date: string;
  time: string;
  description: string;
  fixedEvent = false;
  consecutiveInstances = false;

  // Animation
  advancedOptionsAnimationState = 'off';

  constructor(
    private _viewportService: ViewportService, 
    private _modalService: NgbModal,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.expandedItem$.next(this.itemId);

    this._subscription = this.expandedItem$.subscribe((expandedId) => {
      if (expandedId != this.itemId) {
        this.onCollapse();

        this._cd.detectChanges(); // Prevents error after template-used property is changed (this.collapsed)
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
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

  onOpenDeleteModal(targetModal){
    this._modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }


  formEmpty(form : NgForm){
    return !form.dirty;
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
      this.title = 'Tâche sans nom';
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
