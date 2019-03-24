import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FileUploadComponent } from './fileupload.component';

const routes: Routes = [
  {
    path: '',
    component: FileUploadComponent,
    data: {
      title: 'File upload'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileUploadRoutingModule {}
