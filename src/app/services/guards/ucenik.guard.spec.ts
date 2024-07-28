import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ucenikGuard } from './ucenik.guard';

describe('ucenikGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ucenikGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
