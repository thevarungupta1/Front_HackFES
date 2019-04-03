import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericComponent } from './generic.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ErrorsService } from 'src/app/services/errors.service';
import { RouterTestingModule } from '@angular/router/testing';
import { GenericService } from 'src/app/services/generic.service';
import { of } from 'rxjs';

describe('GenericComponent', () => {
  let component: GenericComponent;
  let fixture: ComponentFixture<GenericComponent>;
  let de: DebugElement;
  let serviceSpy: GenericService
  //beforeEach(() => addProviders([
  //  {
  //    provide: Router,
  //    useClass: class { navigate = jasmine.createSpy("navigate"); }
  //  }]));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [ErrorsService, GenericService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(GenericComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        serviceSpy = fixture.debugElement.injector.get(GenericService);
        fixture.detectChanges();
      });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('weekday should be zero when reset called', () => {
    component.reset();

    fixture.whenStable().then(() => {
      expect(component.weekday).toEqual(0);
    });
  });


  it('fromDate should be undefined when reset called', () => {
    component.reset();

    fixture.whenStable().then(() => {
      expect(component.fromDate).toBeUndefined();
    });
  });


  it('toDate should be undefined when reset called', () => {
    component.reset();

    fixture.whenStable().then(() => {
      expect(component.toDate).toBeUndefined();
    });
  });
});
