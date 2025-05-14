import { TestBed } from '@angular/core/testing';

import { AmistadService } from './amistad.service';

describe('AmistadService', () => {
  let service: AmistadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmistadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
