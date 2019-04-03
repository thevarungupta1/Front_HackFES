import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquisitionComponent } from './acquisition.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from 'src/app/services/errors.service';
import { AcquisitionService } from 'src/app/services/acquisition.service';

describe('AcquisitionComponent', () => {
  let component: AcquisitionComponent;
  let fixture: ComponentFixture<AcquisitionComponent>;
  let de: DebugElement;
  let serviceSpy: AcquisitionService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcquisitionComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [ErrorsService, AcquisitionService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AcquisitionComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
      serviceSpy = fixture.debugElement.injector.get(AcquisitionService);
        fixture.detectChanges();
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getAllNewVolunteers method should be called when getData method invoked by onInit', () => {
    spyOn(component, 'getAllNewVolunteers').and.callThrough();
    component.getData();

    fixture.whenStable().then(() => {
      expect(component.getAllNewVolunteers).toHaveBeenCalledTimes(1);
    });
  });
});
