// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ParticipationComponent } from './participation/participation.component';

import { GenericComponent } from './generic/generic.component';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';

// Carousel Component
import { CarouselModule } from 'ngx-bootstrap/carousel';

// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RetentionComponent } from './retention/retention.component';

// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';
import { EngagementComponent } from './engagement/engagement.component';

// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AcquisitionComponent } from './acquisition/acquisition.component';

// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';


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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    TableModule,
    DialogModule,
    MultiSelectModule,
    ReactiveFormsModule,
    PanelModule,
    ProgressBarModule,
    ToastModule
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
