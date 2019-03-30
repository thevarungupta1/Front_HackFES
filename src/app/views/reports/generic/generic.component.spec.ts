import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericComponent } from './generic.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

describe('GenericComponent', () => {
  let component: GenericComponent;
  let fixture: ComponentFixture<GenericComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericComponent],
      imports: [HttpClientModule],
      providers: [],
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
