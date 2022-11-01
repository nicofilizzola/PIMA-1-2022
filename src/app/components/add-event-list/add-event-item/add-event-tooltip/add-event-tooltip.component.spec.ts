import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventTooltipComponent } from './add-event-tooltip.component';

describe('AddEventTooltipComponent', () => {
  let component: AddEventTooltipComponent;
  let fixture: ComponentFixture<AddEventTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
