import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeFrameSelectComponent } from './time-frame-select.component';

describe('TimeFrameSelectComponent', () => {
  let component: TimeFrameSelectComponent;
  let fixture: ComponentFixture<TimeFrameSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeFrameSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeFrameSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
