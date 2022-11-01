import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventListComponent } from './add-event-list.component';

describe('AddEventListComponent', () => {
  let component: AddEventListComponent;
  let fixture: ComponentFixture<AddEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
