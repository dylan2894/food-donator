import { TestBed } from '@angular/core/testing';

import { DonorGuard } from './donor.guard';

describe('DonorGuard', () => {
  let guard: DonorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DonorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
