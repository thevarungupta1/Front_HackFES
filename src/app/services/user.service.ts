import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
//import { Headers, Response, RequestOptions, ResponseContentType, Http } from '@angular/http';
import { config } from './../config';
import { ErrorsService } from './errors.service';

@Injectable({
    providedIn: 'root'
  })
export class UserService {

  constructor(private http: HttpClient, private errorService: ErrorsService) { }
        
    getValues() : Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Values`)
      .pipe(
        tap(data => JSON.stringify(data)),
        catchError(this.handleError<any>('getValues'))
      ); 
  }
  getRoles(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/User/Roles`)
      .pipe(
        tap(data => {
          JSON.stringify(data)
        }),
      catchError(this.handleError<any>('getRoles'))
      );
  }
  getEvents(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Event`)
      .pipe(
        tap(data => {
          JSON.stringify(data)
        }),
      catchError(this.handleError<any>('getEvents'))
      );
  }


  downloadExcelTemplate(): Observable<any>{
   
    const headers = new HttpHeaders();
    return this.http.get<any>('../../assets/files/ApplicationUsersTemplate.xlsx', {
      headers: headers,
      responseType: 'blob' as 'json'
    })
      .pipe(
        tap(data => {
          JSON.stringify(data)
        }),
      catchError(this.handleError<any>('downloadExcelTemplate'))
      );
  }

  saveUser(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any>(`${config.apiUrl}/User`, body, { headers: headers })
      .pipe(
        tap(data => JSON.stringify(data)),
        catchError(this.handleError<any>('saveUser'))
      );
  }

  savePOC(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any>(`${config.apiUrl}/User/SavePOC`, body, { headers: headers })
      .pipe(
        tap(data => JSON.stringify(data)),
        catchError(this.handleError<any>('savePOC'))
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
