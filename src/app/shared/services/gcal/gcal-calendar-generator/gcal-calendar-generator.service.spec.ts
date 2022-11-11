import { TestBed } from '@angular/core/testing';

import { GcalCalendarGeneratorService } from './gcal-calendar-generator.service';

describe('GcalCalendarGeneratorService', () => {
  let service: GcalCalendarGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GcalCalendarGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
