import { TestBed } from '@angular/core/testing';

import { GenericService } from './generic.service';
import { HttpClientModule } from '@angular/common/http';
import { ErrorsService } from './errors.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FileuploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GenericService, ErrorsService
    ],
    imports: [HttpClientModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: GenericService = TestBed.get(GenericService);
    expect(service).toBeTruthy();
  });
});
