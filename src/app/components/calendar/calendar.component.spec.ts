import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GcalCalendarComponent } from './calendar.component';

describe('GcalCalendarComponent', () => {
  let component: GcalCalendarComponent;
  let fixture: ComponentFixture<GcalCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GcalCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GcalCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
