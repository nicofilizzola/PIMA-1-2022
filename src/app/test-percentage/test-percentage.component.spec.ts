import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPercentageComponent } from './test-percentage.component';

describe('TestPercentageComponent', () => {
  let component: TestPercentageComponent;
  let fixture: ComponentFixture<TestPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPercentageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
