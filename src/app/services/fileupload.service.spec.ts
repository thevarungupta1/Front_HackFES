
import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Associate } from '../models/associate.model';
import { Event } from '../models/event.model';

import { FileuploadService } from './fileupload.service';
import { ErrorsService } from './errors.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FileuploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FileuploadService, ErrorsService
    ],
    imports: [HttpClientModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: FileuploadService = TestBed.get(FileuploadService);
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

  //it(`should save associate details uploaded`, async(inject([HttpClient, HttpTestingController],
  //  (http: HttpClient, backend: HttpTestingController) => {
  //    let bodyString = [{
  //      id: 1234567,
  //      name: "senthil",
  //      designation: "associate",
  //      baseLocation: "chennai",
  //      businessUnit: "health care",
  //      createdBy: "admin",
  //      modifiedBy: ""
  //    }, {
  //      id: 1234567,
  //      name: "senthil",
  //      designation: "associate",
  //      baseLocation: "chennai",
  //      businessUnit: "health care",
  //      createdBy: "admin",
  //      modifiedBy: ""
  //    }];
  //    http.post('/api/Associate', bodyString).subscribe((next) => {
  //      expect(next).toEqual(true);
  //    });

  //    backend.match({
  //      url: '/api/Associate',
  //      method: 'POST'
  //    })[0].flush(true);
  //  })));

  //it(`should expect a POST /api/Associate`, async(inject([HttpClient, HttpTestingController],
  //  (http: HttpClient, backend: HttpTestingController) => {
  //    http.get('/api/Associate').subscribe();

  //    backend.expectOne({
  //      url: '/api/Associate',
  //      method: 'POST'
  //    });
  //  })));


  //it(`should save event details uploaded`, async(inject([HttpClient, HttpTestingController],
  //  (http: HttpClient, backend: HttpTestingController) => {
  //    let bodyString = [{
  //      id: "event1",
  //      name: "eventName",
  //      description: "desc",
  //      date: "12/12/2018",
  //      totalVolunteers: 12,
  //      totalVolunteerHours: 3,
  //      totalTravelHours: 1,
  //      baseLocation: "chennai",
  //      address: "address",
  //      city: "chennai",
  //      state: "tamil nadu",
  //      country: "india",
  //      pincode: "600001",
  //      beneficiary: "school",
  //      councilName: null,
  //      project: "teach",
  //      category: null
  //    }, {
  //      id: "event1",
  //      name: "eventName",
  //      description: "desc",
  //      date: "12/12/2018",
  //      totalVolunteers: 12,
  //      totalVolunteerHours: 3,
  //      totalTravelHours: 1,
  //      baseLocation: "chennai",
  //      address: "address",
  //      city: "chennai",
  //      state: "tamil nadu",
  //      country: "india",
  //      pincode: "600001",
  //      beneficiary: "school",
  //      councilName: null,
  //      project: "teach",
  //      category: null
  //    }];
  //    http.post('/api/Event', bodyString).subscribe((next) => {
  //      expect(next).toEqual(true);
  //    });

  //    backend.match({
  //      url: '/api/Event',
  //      method: 'POST'
  //    })[0].flush(true);
  //  })));

  //it(`should expect a POST /api/Event`, async(inject([HttpClient, HttpTestingController],
  //  (http: HttpClient, backend: HttpTestingController) => {
  //    http.get('/api/Event').subscribe();

  //    backend.expectOne({
  //      url: '/api/Event',
  //      method: 'POST'
  //    });
  //  })));

  //it(`should save enrollment details uploaded`, async(inject([HttpClient, HttpTestingController],
  //  (http: HttpClient, backend: HttpTestingController) => {
  //    let bodyString = [{
  //      eventID: "event1", associateID: 123456, eventDate: "12/12/2018", volunteerHours: 12, travelHours: 4,
  //      status: "Active", businessUnit: "BFS", baseLocation: "Chennai", iiepCategory: "", createdBy: "admin", associates: new Associate, events: new Event
  //    }, {
  //      eventID: "event1", associateID: 123456, eventDate: "12/12/2018", volunteerHours: 12, travelHours: 4,
  //      status: "Active", businessUnit: "BFS", baseLocation: "Chennai", iiepCategory: "", createdBy: "admin", associates: new Associate, events: new Event
  //    }];
  //    http.post('/api/Enrollment', bodyString).subscribe((next) => {
  //      expect(next).toEqual(true);
  //    });

  //    backend.match({
  //      url: '/api/Enrollment',
  //      method: 'POST'
  //    })[0].flush(true);
  //  })));

  //it(`should expect a POST /api/Enrollment`, async(inject([HttpClient, HttpTestingController],
  //  (http: HttpClient, backend: HttpTestingController) => {
  //    http.get('/api/Enrollment').subscribe();

  //    backend.expectOne({
  //      url: '/api/Enrollment',
  //      method: 'POST'
  //    });
  //  })));



});
