import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { User } from './user';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  pageTitle = 'Log In';
  loginForm: FormGroup;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  constructor(private authService: AuthService,
    private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      associateId: ['', Validators.required],
      email: ['', [Validators.pattern(this.mailformat)]]
    });
    this.authService.clearsessionStorage();
  }

  login(){
    if (this.loginForm.valid) {
    let email = this.loginForm.get('email').value;
    let associateId = this.loginForm.get('associateId').value;

    let user: User = { id: associateId, email: email, role: null };
      //this.authService.login(user);
      this.authService.login(associateId, email)
      .subscribe(success => {
        if (success) {
          if (this.authService.redirectUrl) {
            this.router.navigateByUrl(this.authService.redirectUrl);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
        else {
          this.errorMessage = 'Please enter a valid credentials.';
         }
      });     
    } else {
      this.errorMessage = 'Please enter a id and email.';
    }
  }

  submit(event) {
    if (event.keyCode == 13) {
      this.login();
    }
  }

}
