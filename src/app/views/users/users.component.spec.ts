import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ToastService } from '../shared/toastmessages';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from 'src/app/services/errors.service';
import { UserService } from 'src/app/services/user.service';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let de: DebugElement;
  let serviceSpy: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [ToastModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterTestingModule ],
      providers: [MessageService, ErrorsService, UserService ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UsersComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        serviceSpy = fixture.debugElement.injector.get(UserService);
        fixture.detectChanges();
      });
  }));

  beforeEach(() => {
    //fixture = TestBed.createComponent(UsersComponent);
    //component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Reset button should call onFormClear method', () => {
    spyOn(component, 'onFormClear');
    let button = de.nativeElement.querySelector('#btnReset');
    button.click();

    expect(component.onFormClear).toHaveBeenCalledTimes(1);
  });

});
