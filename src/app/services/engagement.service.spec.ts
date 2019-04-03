
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from './errors.service';
import { Response } from 'selenium-webdriver/http';
import { tick } from '@angular/core/src/render3';
import { ResponseOptions } from '@angular/http';
import { Enrollment } from '../models/enrollment.model';
import { Associate } from '../models/associate.model';
import { Event } from '../models/event.model';
import { Observable, of, throwError } from 'rxjs';

import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EngagementService } from './engagement.service';



describe('AcquisitionService', () => {
  let service: EngagementService;
  let mockHttp = jasmine.createSpyObj("mockHttp", ["get", "post"]);
  let mockErrorService = jasmine.createSpyObj("mockHttp", ["get", "post"]);
  let enrollments: Enrollment[] = [{
    eventID: "event1", associateID: 123456, eventDate: "12/12/2018", volunteerHours: 12, travelHours: 4,
    status: "Active", businessUnit: "BFS", baseLocation: "Chennai", iiepCategory: "", createdBy: "admin", associates: new Associate, events: new Event
  },
  {
    eventID: "event2", associateID: 123457, eventDate: "12/12/2018", volunteerHours: 12, travelHours: 4,
    status: "Active", businessUnit: "BFS", baseLocation: "Chennai", iiepCategory: "", createdBy: "admin", associates: new Associate, events: new Event
  }];
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      EngagementService, HttpClient, ErrorsService
    ],
    imports: [HttpClientModule, RouterTestingModule]
  }));

  beforeEach(() => {
    service = new EngagementService(mockHttp, mockErrorService);
  })
  it('should be created', () => {
    const service: EngagementService = TestBed.get(EngagementService);
    expect(service).toBeTruthy();
  });


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
  });

  it(`should return all enrollments`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('/api/Enrollment').subscribe((next) => {
        expect(next).toEqual({
          eventID: "event1", associateID: 123456, eventDate: "12/12/2018", volunteerHours: 12, travelHours: 4,
          status: "Active", businessUnit: "BFS", baseLocation: "Chennai", iiepCategory: "", createdBy: "admin", associates: new Associate, events: new Event
        });
      });

      backend.match({
        url: '/api/Enrollment',
        method: 'GET'
      })[0].flush({
        eventID: "event1", associateID: 123456, eventDate: "12/12/2018", volunteerHours: 12, travelHours: 4,
        status: "Active", businessUnit: "BFS", baseLocation: "Chennai", iiepCategory: "", createdBy: "admin", associates: new Associate, events: new Event
      });
    })));


  it(`should expect a GET /foo/bar`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('/api/Enrollment').subscribe();

      backend.expectOne({
        url: '/api/Enrollment',
        method: 'GET'
      });
    })));

});
