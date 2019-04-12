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
export class EngagementService {

  constructor(private http: HttpClient, private errorService: ErrorsService) { }
  
  getEnrollmentsByFilter(body: ReportFilter): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any[]>(`${config.apiUrl}/Enrollment/GetEnrollmentsByFilter`, body, { headers: headers })
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('getEnrollmentsByFilter'))
      );
  }

  getAllAssociates(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Associate`)
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('getAllAssociates'))
      );
  }

  getAllEvents(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Event`)
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('getAllEvents'))
      );
  }

  getAllEnrollments(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment`)
      .pipe(
        tap(data => {
          let test = data;
          JSON.stringify(data)
        }),
      catchError(this.handleError<any>('getAllEnrollments'))
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
