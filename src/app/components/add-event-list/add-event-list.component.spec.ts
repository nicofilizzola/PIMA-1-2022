import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGcalEventListComponent } from './add-event-list.component';

describe('AddGcalEventListComponent', () => {
  let component: AddGcalEventListComponent;
  let fixture: ComponentFixture<AddGcalEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGcalEventListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGcalEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
