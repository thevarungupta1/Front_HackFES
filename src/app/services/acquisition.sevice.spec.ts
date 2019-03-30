import { TestBed } from '@angular/core/testing';

import { AcquisitionService } from './acquisition.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('AcquisitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AcquisitionService, HttpClient
    ],
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: AcquisitionService = TestBed.get(AcquisitionService);
    expect(service).toBeTruthy();
  });
});
