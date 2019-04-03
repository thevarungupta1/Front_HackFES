
import { GenericService } from './generic.service';
import { ErrorsService } from './errors.service';
import { RouterTestingModule } from '@angular/router/testing';

import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Associate } from '../models/associate.model';
import { Event } from '../models/event.model';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
  });

  it(`should return all associates`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('/api/Associate').subscribe((next) => {
        expect(next).toEqual({
          id: 1234567,
          name: "senthil",
          designation: "associate",
          baseLocation: "chennai",
          businessUnit: "health care",
          createdBy: "admin",
          modifiedBy: ""
        });
      });

      backend.match({
        url: '/api/Associate',
        method: 'GET'
      })[0].flush({
        id: 1234567,
        name: "senthil",
        designation: "associate",
        baseLocation: "chennai",
        businessUnit: "health care",
        createdBy: "admin",
        modifiedBy: ""
      });
    })));

  it(`should expect a GET /api/Associate`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('/api/Associate').subscribe();

      backend.expectOne({
        url: '/api/Associate',
        method: 'GET'
      });
    })));


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

  it(`should return all events`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('/api/Event').subscribe((next) => {
        expect(next).toEqual({
          id: "event1",
          name: "eventName",
          description: "desc",
          date: "12/12/2018",
          totalVolunteers: 12,
          totalVolunteerHours: 3,
          totalTravelHours: 1,
          baseLocation: "chennai",
          address: "address",
          city: "chennai",
          state: "tamil nadu",
          country: "india",
          pincode: "600001",
          beneficiary: "school",
          councilName: null,
          project: "teach",
          category: null
        });
      });

      backend.match({
        url: '/api/Event',
        method: 'GET'
      })[0].flush({
        id: "event1",
        name: "eventName",
        description: "desc",
        date: "12/12/2018",
        totalVolunteers: 12,
        totalVolunteerHours: 3,
        totalTravelHours: 1,
        baseLocation: "chennai",
        address: "address",
        city: "chennai",
        state: "tamil nadu",
        country: "india",
        pincode: "600001",
        beneficiary: "school",
        councilName: null,
        project: "teach",
        category: null
      });
    })));


  it(`should expect a GET /api/Event`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('/api/Event').subscribe();

      backend.expectOne({
        url: '/api/Event',
        method: 'GET'
      });
    })));

});

