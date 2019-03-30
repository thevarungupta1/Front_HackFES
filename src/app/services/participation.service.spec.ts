import { TestBed } from '@angular/core/testing';

import { ParticipationService } from './participation.service';
import { HttpClientModule } from '@angular/common/http';

describe('ParticipationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ParticipationService
    ],
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: ParticipationService = TestBed.get(ParticipationService);
    expect(service).toBeTruthy();
  });
});
