import { TestBed } from '@angular/core/testing';

import { GcalInterceptor } from './gcal.interceptor';

describe('GcalInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GcalInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GcalInterceptor = TestBed.inject(GcalInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
