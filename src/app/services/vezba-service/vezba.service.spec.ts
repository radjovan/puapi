import { TestBed } from '@angular/core/testing';

import { VezbaService } from './vezba.service';

describe('VezbaService', () => {
  let service: VezbaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VezbaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
