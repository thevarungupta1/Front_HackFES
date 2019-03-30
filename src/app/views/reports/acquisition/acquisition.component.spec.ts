import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquisitionComponent } from './acquisition.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from 'src/app/services/errors.service';

describe('AcquisitionComponent', () => {
  let component: AcquisitionComponent;
  let fixture: ComponentFixture<AcquisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcquisitionComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [ErrorsService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
