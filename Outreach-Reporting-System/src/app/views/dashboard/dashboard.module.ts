import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import {TableModule} from 'primeng/table';
import { CommonModule } from '@angular/common';  
import {DialogModule} from 'primeng/dialog';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    TableModule,
    CommonModule,
    DialogModule
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule { }