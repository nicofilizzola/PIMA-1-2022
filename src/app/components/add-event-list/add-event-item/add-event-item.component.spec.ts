import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGcalEventItemComponent } from './add-event-item.component';

describe('AddGcalEventItemComponent', () => {
  let component: AddGcalEventItemComponent;
  let fixture: ComponentFixture<AddGcalEventItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddGcalEventItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddGcalEventItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
