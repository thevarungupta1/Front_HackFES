import { TestBed } from '@angular/core/testing';

import { FileuploadService } from './fileupload.service';
import { HttpClientModule } from '@angular/common/http';

describe('FileuploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FileuploadService
    ],
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: FileuploadService = TestBed.get(FileuploadService);
    expect(service).toBeTruthy();
  });
});
