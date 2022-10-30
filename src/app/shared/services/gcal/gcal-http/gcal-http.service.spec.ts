import { TestBed } from '@angular/core/testing';

import { GcalService } from './gcal-http.service';

describe('GcalService', () => {
  let service: GcalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GcalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
