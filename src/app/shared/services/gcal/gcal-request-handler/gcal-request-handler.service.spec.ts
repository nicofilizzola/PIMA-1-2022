import { TestBed } from '@angular/core/testing';

import { GcalRequestHandlerService } from './gcal-request-handler.service';

describe('GcalRequestHandlerService', () => {
  let service: GcalRequestHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GcalRequestHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
