import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import {TableModule} from 'primeng/table';
import { CommonModule } from '@angular/common';  
import {DialogModule} from 'primeng/dialog';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    TableModule,
    CommonModule,
    DialogModule,
    HttpClientModule    
  ],
  declarations: [DashboardComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class DashboardModule { }
