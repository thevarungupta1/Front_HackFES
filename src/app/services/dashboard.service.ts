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
export class DashboardService {

  constructor(private http: HttpClient, private errorService: ErrorsService) { }
     
    getAllAssociates(): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Associate`)
        .pipe(
          tap(data => JSON.stringify(data)),
        catchError(this.handleError<any>('getAllAssociates'))
        );
    }
  
    getAllEvents(): Observable<Event[]> {
      return this.http.get<any>(`${config.apiUrl}/Event`)
        .pipe(
          tap(data => JSON.stringify(data)),
        catchError(this.handleError<any>('getAllEvents'))
        );
  }

  getRecentEvents(recentCount:number): Observable<Event[]> {
    return this.http.get<any>(`${config.apiUrl}/Event/RecentEvents/${recentCount}`)
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('getRecentEvents'))
      );
  }
  
    getAllEnrollments(): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetEnrolledAssociates`)
        .pipe(
          tap(data => {
            let test = data;
            JSON.stringify(data)
          }),
        catchError(this.handleError<any>('getAllEnrollments'))
        );
    }

    getTopVolunteers(count: number): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetTopFrequentVolunteers?count=${count}`)
        .pipe(
        tap(response => {
          JSON.stringify(response);
          }),
        catchError(this.handleError<any>('getTopVolunteers'))
        );
    }

    getYearlyVolunteers(count: number): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetDesignationWiseVolunteersByYear?years=${count}`)
        .pipe(
          tap(data => {
            let test = data;
            JSON.stringify(data)
          }),
        catchError(this.handleError<any>('getYearlyVolunteers'))
        );
  }

  getYearlyBuVolunteers(count: number): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment/GetYearlyBuWiseVolunteersCount?years=${count}`)
      .pipe(
        tap(data => {
          let test = data;
          JSON.stringify(data)
        }),
      catchError(this.handleError<any>('getYearlyBuVolunteers'))
      );
  }

    GetAllNewVolunteers(): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetAllNewVolunteers`)
        .pipe(
          tap(data => {
            let test = data;
            JSON.stringify(data)
          }),
        catchError(this.handleError<any>('GetAllNewVolunteers'))
        );
    }

    GetDateWiseVolunteers(): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetDateWiseVolunteersCount`)
        .pipe(
          tap(data => {
            JSON.stringify(data)
          }),
        catchError(this.handleError<any>('GetDateWiseVolunteers'))
        );
  }

  GetTopData(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment/GetTopVolunteerData`)
      .pipe(
        tap(data => {
          JSON.stringify(data)
        }),
      catchError(this.handleError<any>('GetTopData'))
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
