import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { FileModel } from '../models/file.model';
import { config } from './../config';
import { ErrorsService } from './errors.service';

@Injectable({
    providedIn: 'root'
  })
export class FileuploadService {

  constructor(private http: HttpClient, private errorService: ErrorsService) { }
        

    saveAssociates(body: any): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let bodyString = JSON.stringify(body);
      return this.http.post<any>(`${config.apiUrl}/Associate`, body, { headers: headers })
        .pipe(
          tap(data => JSON.stringify(data)),
        catchError(this.handleError<any>('saveAssociates'))
        );
    }

  saveEvents(body: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let bodyString = JSON.stringify(body);
      return this.http.post<any>(`${config.apiUrl}/Event`, body, { headers: headers })
          .pipe(
            tap(data => JSON.stringify(data)),
        catchError(this.handleError<any>('saveEvents'))
          );
      }

      saveEnrollments(body: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let bodyString = JSON.stringify(body);
        return this.http.post<any>(`${config.apiUrl}/Enrollment`, body, { headers: headers })
          .pipe(
            tap(data => JSON.stringify(data)),
          catchError(this.handleError<any>('saveEnrollments'))
          );
      }

  saveFileInfo(body: FileModel[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any>(`${config.apiUrl}/File`, body, { headers: headers })
      .pipe(
        tap(data => JSON.stringify(data)),
      catchError(this.handleError<any>('saveFileInfo'))
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
