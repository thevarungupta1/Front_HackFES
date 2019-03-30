import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './fileupload.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastService } from '../shared/toastmessages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpClientModule } from '@angular/common/http';
describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      imports: [ToastModule, HttpClientModule],
      providers: [ToastService, MessageService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    //expect(component).toBeTruthy();
  });
});
