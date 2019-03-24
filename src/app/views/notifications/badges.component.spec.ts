import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgesComponent } from './badges.component';

describe('AlertsComponent', () => {
  let component: BadgesComponent;
  let fixture: ComponentFixture<BadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BadgesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
