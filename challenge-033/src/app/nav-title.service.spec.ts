import { TestBed } from '@angular/core/testing';

import { NavTitleService } from './nav-title.service';

describe('NavTitleService', () => {
  let service: NavTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
