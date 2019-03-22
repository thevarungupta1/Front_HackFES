import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { Associate } from '../models/associate.model';
import { Enrollment } from '../models/enrollment.model';
import { Event } from '../models/event.model';
import { config } from './../config';

@Injectable({
    providedIn: 'root'
  })
export class DashboardService {

    constructor(private http: HttpClient) { }
     
    getAllAssociates(): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Associate`)
        .pipe(
          tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError<any>('getAllAssociates'))
        );
    }
  
    getAllEvents(): Observable<Event[]> {
      return this.http.get<any>(`${config.apiUrl}/Event`)
        .pipe(
          tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError<any>('getAllEvents'))
        );
  }

  getRecentEvents(recentCount:number): Observable<Event[]> {
    return this.http.get<any>(`${config.apiUrl}/Event/RecentEvents/${recentCount}`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError<any>('getRecentEvents'))
      );
  }
  
    getAllEnrollments(): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetEnrolledAssociates`)
        .pipe(
          tap(data => {
            let test = data;
            console.log(JSON.stringify(data))
          }),
        catchError(this.handleError<any>('getAllEnrollments'))
        );
    }

    getTopVolunteers(count: number): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetTopFrequentVolunteers?count=${count}`, { observe: 'response' })
        .pipe(
        tap(response => {
          console.log(JSON.stringify(response));
          }),
        catchError(this.handleError<any>('getTopVolunteers'))
        );
    }

    getYearlyVolunteers(count: number): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetDesignationWiseVolunteersByYear?years=${count}`)
        .pipe(
          tap(data => {
            let test = data;
            console.log(JSON.stringify(data))
          }),
        catchError(this.handleError<any>('getYearlyVolunteers'))
        );
  }

  getYearlyBuVolunteers(count: number): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment/GetYearlyBuWiseVolunteersCount?years=${count}`)
      .pipe(
        tap(data => {
          let test = data;
          console.log(JSON.stringify(data))
        }),
      catchError(this.handleError<any>('getYearlyBuVolunteers'))
      );
  }

    GetAllNewVolunteers(): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetAllNewVolunteers`)
        .pipe(
          tap(data => {
            let test = data;
            console.log(JSON.stringify(data))
          }),
        catchError(this.handleError<any>('GetAllNewVolunteers'))
        );
    }

    GetDateWiseVolunteers(): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetDateWiseVolunteersCount`)
        .pipe(
          tap(data => {
            console.log('GetDateWiseVolunteersCount')
            console.log(JSON.stringify(data))
          }),
        catchError(this.handleError<any>('GetDateWiseVolunteers'))
        );
  }

  GetTopData(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment/GetTopVolunteerData`)
      .pipe(
        tap(data => {
        console.log('GetTopVolunteerData')
          console.log(JSON.stringify(data))
        }),
      catchError(this.handleError<any>('GetTopData'))
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
