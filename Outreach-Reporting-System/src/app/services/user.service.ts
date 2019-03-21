import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Headers, Response, RequestOptions, ResponseContentType, Http } from '@angular/http';
import { config } from './../config';

@Injectable({
    providedIn: 'root'
  })
export class UserService {

    constructor(private http: HttpClient, private xmlHttp: Http) { }
        
    getValues() : Observable<any> {
      return this.http.get<any>(`${config.apiUrl}/Values`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(error => {
                    const message = `Retrieval error: ${error}`;
                    console.error(message);
                    return of({ product: null, error: message });
                  })
      ); 
  }
  getRoles(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/User/GetRoles`)
      .pipe(
        tap(data => {
          console.log(JSON.stringify(data))
        }),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }
  getEvents(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/Event`)
      .pipe(
        tap(data => {
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

  downloadExcelTemplate(): Observable<any>{
    return this.http.get<any>(`${config.apiUrl}/Enrollment/ExcelExport`)
      .pipe(
        tap(data => {
          console.log(JSON.stringify(data))
        }),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
        //  let templatePath = '../../assets/files/Associate Details.xlsx';
        //  let options =new RequestOptions({responseType: ResponseContentType.Blob});

        //  return this.xmlHttp.get(templatePath, options)
        ////   .map(response => {
        ////        return <Blob>response.blob();
        ////   });
        //  .pipe(
        //    tap(data => <Blob>data.blob() ),
        //    catchError(error => {
        //                const message = `Retrieval error: ${error}`;
        //                console.error(message);
        //                return of({ product: null, error: message });
        //              })
        //  ); 
  }

  saveUser(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(body);
    return this.http.post<any>(`${config.apiUrl}/User`, body, { headers: headers })
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
