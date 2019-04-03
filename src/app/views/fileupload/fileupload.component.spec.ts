import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './fileupload.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ToastService } from '../shared/toastmessages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpClientModule } from '@angular/common/http';
import { ErrorsService } from 'src/app/services/errors.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FileuploadService } from '../../services/fileupload.service';
import { of } from 'rxjs';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let de: DebugElement;
  let serviceSpy: FileuploadService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      imports: [ToastModule, HttpClientModule, RouterTestingModule],
      providers: [ToastService, MessageService, ErrorsService, FileuploadService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FileUploadComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        serviceSpy = fixture.debugElement.injector.get(FileuploadService);
        fixture.detectChanges();
      });
  }));

  //beforeEach(() => {
  //  fixture = TestBed.createComponent(FileUploadComponent);
  //  component = fixture.componentInstance;
  //  fixture.detectChanges();
  //});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addFileInfo method should add filename to array', () => {
    component.fileInformation = [];
    component.addFileInfo('fileName');
    expect(component.fileInformation[0]).toEqual({ fileName: 'fileName', createdBy: 123456 });
  });

  it('saveFileInfo method should be called when save uploaded files', () => {
    spyOn(serviceSpy, 'saveFileInfo').and.callThrough();
    component.fileInformation = [];
    component.saveFileInfo();
    expect(serviceSpy.saveFileInfo).toBeDefined();
  });

});
