import { TestBed } from '@angular/core/testing';

import { DoneeGuard } from './donee.guard';

describe('DoneeGuard', () => {
  let guard: DoneeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DoneeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
