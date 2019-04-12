import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from 'src/app/services/errors.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Services } from '@angular/core/src/view';
import { Observable, of } from 'rxjs';
import { Associate } from 'src/app/models/associate.model';
import { Enrollment } from 'src/app/models/enrollment.model';
import { Event } from 'src/app/models/event.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let de: DebugElement;
  let serviceSpy: DashboardService;
  let associates: Associate[] = [{ id: 1, name: 'senthil', designation: 'associate', baseLocation: 'chennai', businessUnit: 'health care', createdBy: 'senthil', modifiedBy: null }]
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [DashboardService, ErrorsService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        serviceSpy = fixture.debugElement.injector.get(DashboardService);
        //fixture.detectChanges();
      });
  }));

  //beforeEach(() => {
  //  fixture = TestBed.createComponent(DashboardComponent);
  //  component = fixture.componentInstance;
  //  fixture.detectChanges();
  //});

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('associate count link click should call showAssociateModal method', () => {
    spyOn(component, 'showAssociateModal');
    let link = de.nativeElement.querySelector('#associateCount');
    link.click();

    expect(component.showAssociateModal).toHaveBeenCalledTimes(1);
  });

  it('volunteers count link click should call showVolunteerModal method', () => {
    spyOn(component, 'showVolunteerModal');
    let link = de.nativeElement.querySelector('#volunteersCount');
    link.click();

    expect(component.showVolunteerModal).toHaveBeenCalledTimes(1);
  });

  it('event count link click should call showEventModal method', () => {
    spyOn(component, 'showEventModal');
    let link = de.nativeElement.querySelector('#eventCount');
    link.click();

    expect(component.showEventModal).toHaveBeenCalledTimes(1);
  });

  it('volunteerHrs link click should call showVolunteerModal method', () => {
    spyOn(component, 'showVolunteerModal');
    let link = de.nativeElement.querySelector('#volunteerHrs');
    link.click();

    expect(component.showVolunteerModal).toHaveBeenCalledTimes(1);
  });

  it('associate count link click should set showAssociatesModal as false', () => {
    spyOn(component, 'showAssociateModal');
    let link = de.nativeElement.querySelector('#associateCount');
    link.click();
    fixture.whenStable().then(() => {
      expect(component.showAssociatesModal).toEqual(false);
    });
  });


  it('getAllAssociates should be called', () => {
    spyOn(serviceSpy, 'getAllAssociates').and.callThrough();
    component.getAllAssociates();

    fixture.whenStable().then(() => {
      expect(serviceSpy.getAllAssociates).toHaveBeenCalledTimes(1);
      expect(component.allAssociates).toEqual(associates);
    });
  });

  it('getAllEvents should be called', () => {
    let eventData: Event[] = [];
    spyOn(serviceSpy, 'getRecentEvents').and.callThrough();
    component.getRecentEvents();

    fixture.whenStable().then(() => {
      expect(serviceSpy.getAllEvents).toBeDefined();
    });
  });

});
