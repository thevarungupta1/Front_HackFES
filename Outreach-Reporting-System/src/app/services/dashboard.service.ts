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
          catchError(error => {
            const message = `Retrieval error: ${error}`;
            console.error(message);
            return of({ product: null, error: message });
          })
        );
    }
  
    getAllEvents(): Observable<Event[]> {
      return this.http.get<any>(`${config.apiUrl}/Event`)
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
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetEnrolledAssociates`)
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
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetTopFrequentVolunteers?count=${count}`)
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
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetYearlyVolunteersCount?years=${count}`)
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

  getYearlyBuVolunteers(count: number): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment/GetYearlyBuWiseVolunteersCount?years=${count}`)
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

    GetAllNewVolunteers(): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetAllNewVolunteers`)
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

    GetDateWiseVolunteers(): Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Enrollment/GetDateWiseVolunteersCount`)
        .pipe(
          tap(data => {
            console.log('GetDateWiseVolunteersCount')
            console.log(JSON.stringify(data))
          }),
          catchError(error => {
            const message = `Retrieval error: ${error}`;
            console.error(message);
            return of({ product: null, error: message });
          })
        );
  }

  GetTopData(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment/GetTopVolunteerData`)
      .pipe(
        tap(data => {
        console.log('GetTopVolunteerData')
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
