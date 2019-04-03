import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionComponent } from './retention.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from 'src/app/services/errors.service';

describe('RetentionComponent', () => {
  let component: RetentionComponent;
  let fixture: ComponentFixture<RetentionComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionComponent],
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers: [ErrorsService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RetentionComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        fixture.detectChanges();
      });
  }));

  beforeEach(() => {
    //fixture = TestBed.createComponent(RetentionComponent);
    //component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
