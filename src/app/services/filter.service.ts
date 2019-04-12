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
export class FilterService {

  constructor(private http: HttpClient, private errorService: ErrorsService) { }


  getBusinessUnits(): Observable<any> {
    return this.http.get<any[]>(`${config.apiUrl}/Enrollment/getBusinessUnits`)
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('getBusinessUnits'))
      );
  }

  GetBaseLocations(): Observable<any> {
    return this.http.get<any[]>(`${config.apiUrl}/Enrollment/GetBaseLocations`)
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('GetBaseLocations'))
      );
  }

  GetFocusAreas(): Observable<any> {
    return this.http.get<any[]>(`${config.apiUrl}/Event/GetAllFocusArea`)
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('GetFocusAreas'))
      );
  }

  getEnrollmentsByFilter(body: ReportFilter): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any[]>(`${config.apiUrl}/Enrollment/EnrollmentsByFilter`, body, { headers: headers })
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('getEnrollmentsByFilter'))
      );
  }

  getEnrollmentsByFilterId(filterId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any[]>(`${config.apiUrl}/Enrollment/EnrollmentsByFilterId?filterId=${filterId}`, { headers: headers })
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('getEnrollmentsByFilterId'))
      );
  }

  saveFilter(body: ReportFilter): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any[]>(`${config.apiUrl}/ReportFilter`, body, { headers: headers })
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('saveFilter'))
      );
  }

  getSavedFilters(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any[]>(`${config.apiUrl}/ReportFilter`, { headers: headers })
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('getSavedFilters'))
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
