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
export class ParticipationService {

  constructor(private http: HttpClient) { }

  getBusinessUnits(): Observable<any> {
    return this.http.get<any[]>(`${config.apiUrl}/Enrollment/getBusinessUnits`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

  GetBaseLocations(): Observable<any> {
    return this.http.get<any[]>(`${config.apiUrl}/Enrollment/GetBaseLocations`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
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
    return this.http.post<any[]>(`${config.apiUrl}/Enrollment/GetEnrollmentsByFilter`, body, { headers: headers })
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
    return this.http.post<any>(`${config.apiUrl}/ReportFilter`, body, { headers: headers })
      .pipe(
        tap(data => console.log('data: ' + JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

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

  getAllEvents(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Event`)
      .pipe(
        tap(data => JSON.stringify(data)),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

  getEnrollments(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment`)
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

  getUniqueVolunteers(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Enrollment/GetEnrolledUniqueAssociates`)
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

  saveAssociates(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any>(`${config.apiUrl}/Associate`, body, { headers: headers })
      .pipe(
        tap(data => console.log('createProduct: ' + JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

  saveEvents(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any>(`${config.apiUrl}/Event`, body, { headers: headers })
      .pipe(
        tap(data => console.log('createProduct: ' + JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

  saveEnrollments(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any>(`${config.apiUrl}/Enrollment`, body, { headers: headers })
      .pipe(
        tap(data => console.log('createProduct: ' + JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }
}
