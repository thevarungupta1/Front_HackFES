// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FileUploadComponent } from './fileupload.component';

// Theme Routing
import { FileUploadRoutingModule } from './fileupload-routing.module';

import { FileUploadModule as fileup } from 'primeng/fileupload';

@NgModule({
  imports: [
    CommonModule,
    FileUploadRoutingModule,
    fileup
  ],
  declarations: [
    FileUploadComponent
  ]
})
export class FileUploadModule { }
