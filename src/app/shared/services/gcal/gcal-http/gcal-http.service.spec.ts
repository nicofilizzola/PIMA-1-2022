import { TestBed } from '@angular/core/testing';

import { GcalHttpService } from './gcal-http.service';

describe('GcalService', () => {
  let service: GcalHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GcalHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
