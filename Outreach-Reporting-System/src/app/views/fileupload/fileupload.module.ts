// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FileUploadComponent } from './fileupload.component';

// Theme Routing
import { FileUploadRoutingModule } from './fileupload-routing.module';

import { FileUploadModule as fileup } from 'primeng/fileupload';

import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  imports: [
    CommonModule,
    FileUploadRoutingModule,
    fileup,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule
  ],
  declarations: [
    FileUploadComponent
  ],
  providers: [
    MessageService
  ]
})
export class FileUploadModule { }
