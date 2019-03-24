import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { config } from './../config';
import { ReportFilter } from '../models/reportFilter.model';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(private http: HttpClient) { }
  

  getUniqVolunteers(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment/GetEnrolledUniqueAssociates`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError<any>('getUniqVolunteers'))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
