import { Injectable } from '@angular/core';

import { User } from '../views/auth/user';
import { MessageService } from '../views/messages/message.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { mapTo } from 'rxjs/internal/operators/mapTo';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Tokens } from '../models/tokens';
import { config } from '../config';
import { HttpHeaders } from '@angular/common/http';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly USER_ROLE = 'USER_ROLE';
  private loggedUser: number;

  constructor(private messageService: MessageService, private http: HttpClient, private errorService: ErrorsService) { }
    currentUser: User;
  redirectUrl: string;

  login(associateId: number, email: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(associateId);
    return this.http.post<any>(`${config.apiUrl}/Auth?id=${associateId}&email=${email}`, { headers: headers })
      .pipe(
      tap(tokens => { this.doLoginUser(associateId, tokens);}),
        mapTo(true),
      catchError(this.handleError<any>('login')));
  }

  logout() {
    return this.http.post<any>(`${config.apiUrl}/Auth/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(this.handleError<any>('logout')));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  //refreshToken() {
  //  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //  let bodyString = JSON.stringify(associateId);
  //  return this.http.post<any>(`${config.apiUrl}/Auth`, bodyString, { headers: headers })
  //    .pipe(
  //    tap(tokens => this.doLoginUser(parseInt(associateId), tokens)),
  //      mapTo(true),
  //    catchError(this.handleError<any>('refreshToken')));
  //}

  getJwtToken() {
    return sessionStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(associateId: number, tokens) {
    this.loggedUser = associateId;
    if (tokens !== undefined || tokens !== null) {
      sessionStorage.setItem(this.USER_ROLE, tokens.role);
      this.storeJwtToken(tokens.token);
    }
  }

  public getUserRole(): string {
    return sessionStorage.getItem(this.USER_ROLE);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return sessionStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    sessionStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    sessionStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    sessionStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  clearsessionStorage() {
    sessionStorage.removeItem(this.JWT_TOKEN);
    sessionStorage.removeItem(this.USER_ROLE);
  }
  removeTokens() {
    sessionStorage.removeItem(this.JWT_TOKEN);
    sessionStorage.removeItem(this.REFRESH_TOKEN);
    sessionStorage.removeItem(this.USER_ROLE);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.errorService.logError(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
