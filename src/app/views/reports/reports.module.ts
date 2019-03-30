// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { ParticipationComponent } from './participation/participation.component';

import { GenericComponent } from './generic/generic.component';

// Tabs Component
//import { TabsModule } from 'ngx-bootstrap/tabs';

// Carousel Component
//import { CarouselModule } from 'ngx-bootstrap/carousel';

// Collapse Component
//import { CollapseModule } from 'ngx-bootstrap/collapse';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Pagination Component
//import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RetentionComponent } from './retention/retention.component';

// Popover Component
//import { PopoverModule } from 'ngx-bootstrap/popover';
import { EngagementComponent } from './engagement/engagement.component';

// Progress Component
//import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AcquisitionComponent } from './acquisition/acquisition.component';

// Tooltip Component
//import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { HttpClientModule } from '@angular/common/http';

// Components Routing
import { ReportsRoutingModule } from './reports-routing.module';
import {TableModule} from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';

import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from '../shared/filter/filter.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from '../messages/message.service';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    BsDropdownModule.forRoot(),
    TableModule,
    DialogModule,
    MultiSelectModule,
    ReactiveFormsModule,
    PanelModule,
    ProgressBarModule,
    ToastModule,
    RadioButtonModule,
    HttpClientModule
  ],
  declarations: [
    ParticipationComponent,
    GenericComponent,
    EngagementComponent,
    RetentionComponent,
    AcquisitionComponent,
    FilterComponent
  ],
  providers: [MessageService]
})
export class ReportsModule { }
