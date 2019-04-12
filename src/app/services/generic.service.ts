import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { config } from './../config';
import { ReportFilter } from '../models/reportFilter.model';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(private http: HttpClient, private errorService: ErrorsService) { }
  

  getUniqVolunteers(fromDate?: Date, toDate?: Date): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment/UniqueVolunteersByDate?fromDate=${fromDate}&toDate=${toDate}`)
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('getUniqVolunteers'))
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
