import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { Associate } from '../models/associate.model';
import { Enrollment } from '../models/enrollment.model';
import { Event } from '../models/event.model';
import { config } from './../config';
import { ErrorsService } from './errors.service';

@Injectable({
    providedIn: 'root'
  })
export class AcquisitionService {

  constructor(private http: HttpClient, private errorService: ErrorsService) { }

  GetAllNewVolunteers(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment`)
        .pipe(
          tap(data => {
          JSON.stringify(data);
          }),
      catchError(this.handleError<any>('GetAllNewVolunteers'))
        );
    }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.errorService.logError(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
