 import { Injectable } from '@angular/core';
 import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
 import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
 import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

 @Injectable()
 export class TokenInterceptor implements HttpInterceptor {

   private isRefreshing = false;
   private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

   constructor(public authService: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

      if (this.authService.getJwtToken()) {
        request = this.addToken(request, this.authService.getJwtToken());
      }

      return next.handle(request).pipe(catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.authService.removeTokens();
          this.router.navigate(['/login']);
          return of({});
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
     //this.router.navigate(['/login']);
     return false;
     //if (!this.isRefreshing) {
     //  this.isRefreshing = true;
     //  this.refreshTokenSubject.next(null);

     //  return this.authService.refreshToken().pipe(
     //    switchMap((token: any) => {
     //      this.isRefreshing = false;
     //      this.refreshTokenSubject.next(token.jwt);
     //      console.log('token.jwt');
     //      console.log(token.jwt);
     //      return next.handle(this.addToken(request, token.jwt));
     //    }));

     //} else {
     //  return this.refreshTokenSubject.pipe(
     //    filter(token => token != null),
     //    take(1),
     //    switchMap(jwt => {
     //      return next.handle(this.addToken(request, jwt));
     //    }));
     //}
   }
 }
