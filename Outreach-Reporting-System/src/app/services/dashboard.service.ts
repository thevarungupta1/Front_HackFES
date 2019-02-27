import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class DashboardService {
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

    post(): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let data = '1234';
      return this.http.post<any>(this.baseUrl+'Values', data, { headers: headers })
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