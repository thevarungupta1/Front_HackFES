import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationComponent } from './participation.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

describe('ParticipationComponent', () => {
  let component: ParticipationComponent;
  let fixture: ComponentFixture<ParticipationComponent>;
  let de: DebugElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ParticipationComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
