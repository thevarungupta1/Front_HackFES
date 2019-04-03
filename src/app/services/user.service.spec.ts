
import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Associate } from '../models/associate.model';
import { Event } from '../models/event.model';

import { UserService } from './user.service';
import { ErrorsService } from './errors.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UserService, ErrorsService
    ],
    imports: [HttpClientModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
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


  it(`should expect a GET /api/Event`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('/api/Event').subscribe();

      backend.expectOne({
        url: '/api/Event',
        method: 'GET'
      });
    })));


  it(`should return all user roles`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('/api/User/Roles').subscribe((next) => {
        expect(next).toEqual({
          role:"admin"
        });
      });

      backend.match({
        url: '/api/User/Roles',
        method: 'GET'
      })[0].flush({
        role: "admin"
      });
    })));


  it(`should expect a GET /api/User/Roles`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('/api/User/Roles').subscribe();

      backend.expectOne({
        url: '/api/User/Roles',
        method: 'GET'
      });
    })));

});
