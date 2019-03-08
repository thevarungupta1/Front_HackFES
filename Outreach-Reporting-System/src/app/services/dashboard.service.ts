import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { Associate } from '../models/associate.model';
import { Enrollment } from '../models/enrollment.model';
import { Event } from '../models/event.model';

@Injectable({
    providedIn: 'root'
  })
export class DashboardService {
    baseUrl: string = 'https://localhost:44313/api/';

    constructor(private http: HttpClient) { }
     
    getAllAssociates(): Observable<any> {
      return this.http.get<any>(this.baseUrl + 'Associate')
        .pipe(
          tap(data => console.log(JSON.stringify(data))),
          catchError(error => {
            const message = `Retrieval error: ${error}`;
            console.error(message);
            return of({ product: null, error: message });
          })
        );
    }
  
    getAllEvents(): Observable<Event[]> {
      return this.http.get<any>(this.baseUrl + 'Event')
        .pipe(
          tap(data => console.log(JSON.stringify(data))),
          catchError(error => {
            const message = `Retrieval error: ${error}`;
            console.error(message);
            return of({ product: null, error: message });
          })
        );
    }
  
    getAllEnrollments(): Observable<any> {
      return this.http.get<any>(this.baseUrl + 'Enrollment/GetEnrolledAssociates')
        .pipe(
          tap(data => {
            let test = data;
            console.log(JSON.stringify(data))
          }),
          catchError(error => {
            const message = `Retrieval error: ${error}`;
            console.error(message);
            return of({ product: null, error: message });
          })
        );
    }

    getTopVolunteers(count: number): Observable<any> {
      return this.http.get<any>(this.baseUrl + `Enrollment/GetTopFrequentVolunteers?count=${count}`)
        .pipe(
          tap(data => {
            let test = data;
            console.log(JSON.stringify(data))
          }),
          catchError(error => {
            const message = `Retrieval error: ${error}`;
            console.error(message);
            return of({ product: null, error: message });
          })
        );
    }

    getYearlyVolunteers(count: number): Observable<any> {
      return this.http.get<any>(this.baseUrl + `Enrollment/GetYearlyVolunteersCount?years=${count}`)
        .pipe(
          tap(data => {
            let test = data;
            console.log(JSON.stringify(data))
          }),
          catchError(error => {
            const message = `Retrieval error: ${error}`;
            console.error(message);
            return of({ product: null, error: message });
          })
        );
    }

}