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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly USER_ID = 'USER_ID';
  private readonly USER_ROLE = 'USER_ROLE';
  private loggedUser: number;

    constructor(private messageService: MessageService, private http: HttpClient) { }
    currentUser: User;
  redirectUrl: string;

  login(associateId: number): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(associateId);
    return this.http.post<any>(`${config.apiUrl}/Auth`, bodyString, { headers: headers })
      .pipe(
      tap(tokens => { this.doLoginUser(associateId, tokens); console.log(tokens);}),
        mapTo(true),
        catchError(error => {
          console.log(error.error);
          return of(false);
        }));
  }

  logout() {
    return this.http.post<any>(`${config.apiUrl}/Auth/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    let associateId = localStorage.getItem(this.USER_ID);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(associateId);
    return this.http.post<any>(`${config.apiUrl}/Auth`, bodyString, { headers: headers })
      .pipe(
      tap(tokens => this.doLoginUser(parseInt(associateId), tokens)),
        mapTo(true),
        catchError(error => {
          console.log(error.error);
          return of(false);
        }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(associateId: number, tokens) {
    this.loggedUser = associateId;
    console.log('tokens1');
    console.log(tokens);
    if (tokens !== undefined || tokens !== null) {
     
      localStorage.setItem(this.USER_ID, associateId.toString());
      localStorage.setItem(this.USER_ROLE, tokens.role);
      this.storeJwtToken(tokens.token);
    }
  }

  public getUserRole(): string {
    return localStorage.getItem(this.USER_ROLE);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  clearLocalStorage() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USER_ID);
    localStorage.removeItem(this.USER_ROLE);
  }
  removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
