import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventItemComponent } from './add-event-item.component';

describe('AddEventItemComponent', () => {
  let component: AddEventItemComponent;
  let fixture: ComponentFixture<AddEventItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEventItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
