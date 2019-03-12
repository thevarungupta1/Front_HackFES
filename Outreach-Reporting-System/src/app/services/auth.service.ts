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
  private loggedUser: string;

    constructor(private messageService: MessageService, private http: HttpClient) { }

    currentUser: User;
  redirectUrl: string;

  login(user: User): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(user.email);
    return this.http.post<any>(`${config.apiUrl}/Auth`, bodyString, { headers: headers })
      .pipe(
        tap(tokens => {this.doLoginUser(user.email, tokens); console.log(tokens);}),
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

  refreshToken(user: User) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let bodyString = JSON.stringify(user.email);
    return this.http.post<any>(`${config.apiUrl}/auth/refresh`, bodyString, { headers: headers })
      .pipe(
        tap(tokens => this.doLoginUser(user.email, tokens)),
        mapTo(true),
        catchError(error => {
          console.log(error.error);
          return of(false);
        }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(username: string, tokens) {
    this.loggedUser = username;
    console.log('tokens1');
    console.log(tokens);
    if(tokens !== undefined || tokens !== null)
    this.storeJwtToken(tokens.token);
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

  removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
