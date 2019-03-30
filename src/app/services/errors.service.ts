import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, Event, NavigationError } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
//import 'rxjs/add/observable/of';

import * as StackTraceParser from 'error-stack-parser';

@Injectable()
export class ErrorsService {

  constructor(
    private injector: Injector,
    private router: Router,
  ) {
    // Subscribe to the NavigationError
    //this.router
    //      .events  
    //      .subscribe((event: Event) => { 
    //        if (event instanceof NavigationError) {
    //            // Redirect to the ErrorComponent
    //            this.log(event.error)
    //                    .subscribe((errorWithContext) => { 
    //                      this.router.navigate(['/error'], { queryParams: errorWithContext })
    //                    });                
    //        }
    //      });
  }
  
  logError(error) {
    // Send error to server
    const errorToSend = this.addContextInfo(error);
    console.log(errorToSend);
    return fakeHttpService.post(errorToSend);
  }

  addContextInfo(error) {
    // You can include context details here (usually coming from other services: UserService...)
    const name = error.name || null;
    const appId = 'reportingSystem';
    const time = new Date().getTime();
    const id = `${appId}-${time}`;
    const location = this.injector.get(LocationStrategy);
    const url = location instanceof PathLocationStrategy ? location.path() : '';
    const status = error.status || null;
    const message = error.message || error.toString();
    const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);

    const errorWithContext = {name, appId, time, id, url, status, message, stack};
    return errorWithContext;
  }

}

class fakeHttpService {
  static post(error): Observable<any> {
    console.log('Error sent to the server: ', error);
    return null;//Observable.of(error);
  }
}
