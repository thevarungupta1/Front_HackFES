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
export class AcquisitionService {

    constructor(private http: HttpClient) { }

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

}
