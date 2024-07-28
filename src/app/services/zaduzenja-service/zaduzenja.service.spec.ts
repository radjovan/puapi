import { TestBed } from '@angular/core/testing';

import { ZaduzenjaService } from './zaduzenja.service';

describe('ZaduzenjaService', () => {
  let service: ZaduzenjaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZaduzenjaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
