import { TestBed } from '@angular/core/testing';

import { GenericService } from './generic.service';
import { HttpClientModule } from '@angular/common/http';

describe('FileuploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GenericService
    ],
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: GenericService = TestBed.get(GenericService);
    expect(service).toBeTruthy();
  });
});
