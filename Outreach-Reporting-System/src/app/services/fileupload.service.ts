import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { FileModel } from '../models/file.model';
import { config } from './../config';

@Injectable({
    providedIn: 'root'
  })
export class FileuploadService {

    constructor(private http: HttpClient) { }
        
    // getValues() : Observable<any> {
    //     return this.http.get<any>(this.baseUrl+'Values')
    //   .pipe(
    //     tap(data => console.log(JSON.stringify(data))),
    //     catchError(error => {
    //                 const message = `Retrieval error: ${error}`;
    //                 console.error(message);
    //                 return of({ product: null, error: message });
    //               })
    //   ); 
    // }

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
        console.log(bodyString);
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

  saveFileInfo(body: FileModel[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any>(`${config.apiUrl}/File`, body, { headers: headers })
      .pipe(
        tap(data => console.log('file added: ' + JSON.stringify(data))),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }
}
