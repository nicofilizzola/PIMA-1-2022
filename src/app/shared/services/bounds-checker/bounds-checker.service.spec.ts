import { TestBed } from '@angular/core/testing';

import { BoundsCheckerService } from './bounds-checker.service';

describe('BoundsCheckerService', () => {
  let service: BoundsCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoundsCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
