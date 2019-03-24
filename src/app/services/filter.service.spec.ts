//import { ResponseOptions } from '@angular/http';



//export const appcontext: any = '{"AuthorizationKey": "bearer key"}';

//export const gridColumnsResult: any = '{"gridcolumns":["document","document type"]';

//describe('patientdetails service test', () => {
//  let httpclientmock: any
//  let logservicemock: any;
//  const appContextPath = '../asset/config/appconfig.json';
//  const gridcolumnPath = '../asset/config/gridcolumns.json';
//  const intakeDocGridColumnPath = '../asset';
//  const config: AppConfig = new Appconfig('test');
//  const api: ApiService = new ApiService(httpClientmock, logservicemock, config);
//  let service = new ReportFilterService(httpclientmock, appContextPath, gridcolumnPath, intakeDocGridColumnPath, config, api);
//  const serviceMock = jasmine.createSpyObj('ReportFilterService', ['loadconfig', 'createBearerToken', 'getUserDetails']);

//  beforeEach(() => {
//    httpclientmock = jasmine.createSpyObj('httpclientmock', ['get']);
//    service = new ReportFilterService(httpclientmock, appcontextpath, gridcolumnpath, intakepath, config, api);
//  });

//  it('it should get app config', fakeAsync(() => {
//    const options = new ResponseOptions;
//    options.body = appContext;
//    const headers = new Headers({ 'Content-Type': 'application/json' });
//    options.status = 200;
//    options.headers = headers;

//    const res = new Response(options);

//    httpclientmock.get.and.returnValue(Observable.of(res));
//    service.loadConfig().subscribe(res => {
//      expect(res['AuthorizationKey']).toBe('bearer 12345');
//    });
//  }));

//  it('it should get grid columns', fakeAsync(() => {
//    const options = new ResponseOptions;
//    options.body = appContext;
//    const headers = new Headers({ 'Content-Type': 'application/json' });
//    options.status = 200;
//    options.headers = headers;
//    const res = new Response(options);
//    httpclientmock.get.and.returnValue(Observable.of(res));
//    service.loadgridColumns().subscribe(res => {
//      expect(res['status']).toBe(200);
//    });
//  }));

//  it('it should get bearer token', fakeAsync(() => {
//    reportfilterServiceMock.createBearerToken.and.returnValue(Observable.of('bearer 12345'));
//    const result = service.createBearerToken();
//    expect(result).toEqual('bearer 12345')
//  }));
//});
import { TestBed } from '@angular/core/testing';

import { FilterService } from './filter.service';

describe('FilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterService = TestBed.get(FilterService);
    expect(service).toBeTruthy();
  });
});
