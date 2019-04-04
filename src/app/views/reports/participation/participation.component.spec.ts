import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationComponent } from './participation.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ErrorsService } from 'src/app/services/errors.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ParticipationService } from 'src/app/services/participation.service';
import { of } from 'rxjs';
import { Associate } from 'src/app/models/associate.model';

describe('ParticipationComponent', () => {
  let component: ParticipationComponent;
  let fixture: ComponentFixture<ParticipationComponent>;
  let de: DebugElement;
  let serviceSpy: ParticipationService;
  let associates: Associate[] = [{ id: 1, name: 'senthil', designation: 'associate', baseLocation: 'chennai', businessUnit: 'health care', createdBy: 'senthil', modifiedBy: null }]
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [ParticipationComponent],
      providers: [ErrorsService, ParticipationService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ParticipationComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        serviceSpy = fixture.debugElement.injector.get(ParticipationService);
        fixture.detectChanges();
      });
  }));

  beforeEach(() => {
    //fixture = TestBed.createComponent(ParticipationComponent);
    //component = fixture.componentInstance;
    //de = fixture.debugElement;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //it('onDataFiltered should be called', () => {
  //  spyOn(serviceSpy, 'getAllAssociates').and.returnValue(of(associates));
  //  component.onDataFiltered(null);

  //  expect(component.allAssociates).toEqual(associates);
  //});


  //it('allenrollments should be null', () => {
  //  spyOn(serviceSpy, 'getAllAssociates').and.returnValue(of({ associates }));
  //  component.onDataFiltered(null);

  //  expect(component.allEnrollments).toEqual(null);
  //});

});
