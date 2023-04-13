import { TestBed } from '@angular/core/testing';

import { OidcAuthService } from './oidc-auth.service';

describe('OidcAuthService', () => {
  let service: OidcAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OidcAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
