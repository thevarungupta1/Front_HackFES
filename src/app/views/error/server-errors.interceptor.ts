
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';

//import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/delay';
// import 'rxjs/add/operator/retry';

import { ErrorsService } from '../../services/errors.service';
import { User } from '../auth/user';

@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private errorsService: ErrorsService,
    public authService: AuthService
  ) { }
  
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.getJwtToken()) {
      request = this.addToken(request, this.authService.getJwtToken());
    }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(request, next);
      } else {
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    //remove current token
    this.authService.removeTokens();
    //this.router.navigate(['/login']);
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      //return this.authService.refreshToken().pipe(
      //  switchMap((token: any) => {
      //    this.isRefreshing = false;
      //    console.log('token.jwt');
      //    console.log(token.jwt);
      //    this.refreshTokenSubject.next(token.jwt);
      //    return next.handle(this.addToken(request, token.jwt));
      //  }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  //   return next.handle(request);//.retry(5);

  // }
}
