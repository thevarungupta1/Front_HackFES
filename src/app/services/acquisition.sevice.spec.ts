import { TestBed, fakeAsync } from '@angular/core/testing';

import { AcquisitionService } from './acquisition.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from './errors.service';
import { Response } from 'selenium-webdriver/http';
import { tick } from '@angular/core/src/render3';

describe('AcquisitionService', () => {
  let service: AcquisitionService;
  let mockHttp = jasmine.createSpyObj("mockHttp", ["get", "post"]);
  let mockErrorService = jasmine.createSpyObj("mockHttp", ["get", "post"]);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AcquisitionService, HttpClient, ErrorsService
    ],
    imports: [HttpClientModule, RouterTestingModule]
  }));

  beforeEach(() => {
    service = new AcquisitionService(mockHttp, mockErrorService);
  })
  it('should be created', () => {
    const service: AcquisitionService = TestBed.get(AcquisitionService);
    expect(service).toBeTruthy();
  });
  
});
