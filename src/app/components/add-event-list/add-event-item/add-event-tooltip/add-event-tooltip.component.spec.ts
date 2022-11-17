import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGcalEventTooltipComponent } from './add-event-tooltip.component';

describe('AddGcalEventTooltipComponent', () => {
  let component: AddGcalEventTooltipComponent;
  let fixture: ComponentFixture<AddGcalEventTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGcalEventTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGcalEventTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
