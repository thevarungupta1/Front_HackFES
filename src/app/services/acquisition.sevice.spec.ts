import { TestBed } from '@angular/core/testing';

import { AcquisitionService } from './acquisition.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from './errors.service';

describe('AcquisitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AcquisitionService, HttpClient, ErrorsService
    ],
    imports: [HttpClientModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: AcquisitionService = TestBed.get(AcquisitionService);
    expect(service).toBeTruthy();
  });
});
