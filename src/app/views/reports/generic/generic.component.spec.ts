import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericComponent } from './generic.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ErrorsService } from 'src/app/services/errors.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('GenericComponent', () => {
  let component: GenericComponent;
  let fixture: ComponentFixture<GenericComponent>;

  //beforeEach(() => addProviders([
  //  {
  //    provide: Router,
  //    useClass: class { navigate = jasmine.createSpy("navigate"); }
  //  }]));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [ErrorsService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
