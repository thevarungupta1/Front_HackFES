import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class FileuploadService {
    baseUrl: string = 'https://localhost:44313/api/';

    constructor(private http: HttpClient) { }
        
    getValues() : Observable<any> {
        return this.http.get<any>(this.baseUrl+'Values')
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
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
      return this.http.post<any>(this.baseUrl+'Associate', body, { headers: headers })
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
        return this.http.post<any>(this.baseUrl+'Event', body, { headers: headers })
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
        return this.http.post<any>(this.baseUrl+'Enrollment', body, { headers: headers })
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