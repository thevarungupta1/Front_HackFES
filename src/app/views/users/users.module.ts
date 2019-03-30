import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Buttons Routing
import { UsersRoutingModule } from './users-routing.module';

import { FileUploadModule as fileup } from 'primeng/fileupload';

import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/components/common/messageservice';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

// Angular

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    fileup,
    ToastModule,
    ReactiveFormsModule,
    MultiSelectModule
  ],
  declarations: [
    UsersComponent
  ],
  providers:[MessageService]
})
export class UsersModule { }
