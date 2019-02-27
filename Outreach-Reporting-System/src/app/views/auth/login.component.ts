import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from './user';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  errorMessage: string;
  pageTitle = 'Log In';

  constructor(private authService: AuthService,
              private router: Router) { }

  login(){//loginForm: NgForm) {
    //if (loginForm && loginForm.valid) {
      const userName = 'admin';//loginForm.form.value.userName;
      const password = 'admin';//loginForm.form.value.password;
      let user:User = { id:0, email: 'test@test.com', role: null };
      //this.authService.login(user);
      this.authService.login(user)
      .subscribe(success => {
        if (success) {
          if (this.authService.redirectUrl) {
            this.router.navigateByUrl(this.authService.redirectUrl);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
        else {
          this.errorMessage = 'Please enter a valid email.';
         }
      });
     
   // } else {
     // this.errorMessage = 'Please enter a user name and password.';
    //}
  }
}
