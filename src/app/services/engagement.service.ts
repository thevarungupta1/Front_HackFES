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
export class EngagementService {

  constructor(private http: HttpClient) { }
  
  getEnrollmentsByFilter(body: ReportFilter): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any[]>(`${config.apiUrl}/Enrollment/GetEnrollmentsByFilter`, body, { headers: headers })
      .pipe(
        tap(data => console.log('data: ' + JSON.stringify(data))),
      catchError(this.handleError<any>('getEnrollmentsByFilter'))
      );
  }

  getAllAssociates(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Associate`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError<any>('getAllAssociates'))
      );
  }

  getAllEvents(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Event`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError<any>('getAllEvents'))
      );
  }

  getAllEnrollments(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment`)
      .pipe(
        tap(data => {
          let test = data;
          console.log(JSON.stringify(data))
        }),
      catchError(this.handleError<any>('getAllEnrollments'))
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
