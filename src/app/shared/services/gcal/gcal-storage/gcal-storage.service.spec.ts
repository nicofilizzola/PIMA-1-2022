import { TestBed } from '@angular/core/testing';

import { GcalStorageService } from './gcal-storage.service';

describe('GcalStorageService', () => {
  let service: GcalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GcalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
