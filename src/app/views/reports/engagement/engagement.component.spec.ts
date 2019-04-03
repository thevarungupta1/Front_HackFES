import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngagementComponent } from './engagement.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { EngagementService } from 'src/app/services/engagement.service';
import { ErrorsService } from 'src/app/services/errors.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('EngagementComponent', () => {
  let component: EngagementComponent;
  let fixture: ComponentFixture<EngagementComponent>;
  let de: DebugElement;
  let serviceSpy: EngagementService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EngagementComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [EngagementService, ErrorsService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EngagementComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        serviceSpy = fixture.debugElement.injector.get(EngagementService);
        fixture.detectChanges();
      });
  }));

  beforeEach(() => {
    //fixture = TestBed.createComponent(EngagementComponent);
    //component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
