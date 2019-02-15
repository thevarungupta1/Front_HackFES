// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ParticipationComponent } from './participation.component';

import { GenericComponent } from './generic.component';

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
import { RetentionComponent } from './retention.component';

// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';
import { EngagementComponent } from './engagement.component';

// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AcquisitionComponent } from './acquisition.component';

// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';


// Components Routing
import { ReportsRoutingModule } from './reports-routing.module';

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
    TooltipModule.forRoot()
  ],
  declarations: [
    ParticipationComponent,
    GenericComponent,
    EngagementComponent,
    RetentionComponent,
    AcquisitionComponent
  ]
})
export class ReportsModule { }
