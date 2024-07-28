import { TestBed } from '@angular/core/testing';

import { ZadatakService } from './zadatak.service';

describe('ZadatakService', () => {
  let service: ZadatakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZadatakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
