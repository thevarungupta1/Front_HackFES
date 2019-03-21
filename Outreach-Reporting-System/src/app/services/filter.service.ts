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
export class FilterService {

  constructor(private http: HttpClient) { }


  getBusinessUnits(): Observable<any> {
    return this.http.get<any[]>(`${config.apiUrl}/Enrollment/getBusinessUnits`)
      .pipe(
        tap(data => JSON.stringify(data)),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          return of({ error: message });
        })
      );
  }

  GetBaseLocations(): Observable<any> {
    return this.http.get<any[]>(`${config.apiUrl}/Enrollment/GetBaseLocations`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error();
          return of({  error: message });
        })
      );
  }

  GetFocusAreas(): Observable<any> {
    return this.http.get<any[]>(`${config.apiUrl}/Event/GetAllFocusArea`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

  getEnrollmentsByFilter(body: ReportFilter): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any[]>(`${config.apiUrl}/Enrollment/EnrollmentsByFilter`, body, { headers: headers })
      .pipe(
        tap(data => console.log('data: ' + JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

  getEnrollmentsByFilterId(filterId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any[]>(`${config.apiUrl}/Enrollment/EnrollmentsByFilterId?filterId=${filterId}`, { headers: headers })
      .pipe(
        tap(data => console.log('data: ' + JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

  saveFilter(body: ReportFilter): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any[]>(`${config.apiUrl}/ReportFilter`, body, { headers: headers })
      .pipe(
        tap(data => console.log('data: ' + JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

  getSavedFilters(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any[]>(`${config.apiUrl}/ReportFilter`, { headers: headers })
      .pipe(
        tap(data => console.log('data: ' + JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

}
