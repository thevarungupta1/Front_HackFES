import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { ErrorsService } from './errors.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DashboardService, ErrorsService
    ],
    imports: [HttpClientModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: DashboardService = TestBed.get(DashboardService);
    expect(service).toBeTruthy();
  });
});
