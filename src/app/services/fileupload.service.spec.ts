import { TestBed } from '@angular/core/testing';

import { FileuploadService } from './fileupload.service';
import { HttpClientModule } from '@angular/common/http';
import { ErrorsService } from './errors.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FileuploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FileuploadService, ErrorsService
    ],
    imports: [HttpClientModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: FileuploadService = TestBed.get(FileuploadService);
    expect(service).toBeTruthy();
  });
});
