import { TestBed } from '@angular/core/testing';

import { ParticipationService } from './participation.service';
import { HttpClientModule } from '@angular/common/http';
import { ErrorsService } from './errors.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ParticipationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ParticipationService, ErrorsService
    ],
    imports: [HttpClientModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: ParticipationService = TestBed.get(ParticipationService);
    expect(service).toBeTruthy();
  });
});
